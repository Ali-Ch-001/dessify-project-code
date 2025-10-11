import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Client } from '@gradio/client';

// Initialize Supabase client with service role for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface GradioResponse {
  data: unknown[];
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('file') as File;
    const userId = formData.get('user_id') as string;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log('Processing upload for user:', userId, 'File:', imageFile.name);

    // Step 1: Upload image to Supabase Storage
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}_${crypto.randomUUID()}.${fileExt}`;
    
    const imageBuffer = await imageFile.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('userwardrobe')
      .upload(fileName, imageBuffer, {
        contentType: imageFile.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload image to storage', details: uploadError.message },
        { status: 500 }
      );
    }

    console.log('Image uploaded to storage:', uploadData.path);

    // Step 2: Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('userwardrobe')
      .getPublicUrl(uploadData.path);

    console.log('Public URL:', publicUrl);

    // Step 3: Call AI Service for categorization
    let category = 'uncategorized'; // Default category
    
    try {
      const aiServiceUrl = process.env.NEXT_PUBLIC_AI_CATEGORIZATION_SERVICE;
      
      if (aiServiceUrl) {
        console.log('Connecting to AI categorization service:', aiServiceUrl);
        
        const imageBlob = new Blob([imageBuffer], { type: imageFile.type });
        const client = await Client.connect(aiServiceUrl);
        
        // Try to predict with timeout
        const result = await Promise.race([
          client.predict("/predict", { 
            input_image: imageBlob,
          }) as Promise<GradioResponse>,
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('AI service timeout')), 30000)
          )
        ]);

        console.log('AI categorization response:', JSON.stringify(result, null, 2));

        // Extract category from response
        if (result && result.data && Array.isArray(result.data) && result.data.length > 0) {
          const categoryResult = result.data[0];
          if (typeof categoryResult === 'string') {
            category = categoryResult.toLowerCase();
          } else if (typeof categoryResult === 'object' && categoryResult !== null) {
            // Handle object response (e.g., {label: "shirt", confidence: 0.95})
            const resultObj = categoryResult as { label?: string; category?: string };
            category = (resultObj.label || resultObj.category || 'uncategorized').toLowerCase();
          }
          console.log('Extracted category:', category);
        }
      } else {
        console.log('No AI service configured, using default category');
      }
    } catch (aiError) {
      console.error('AI categorization error:', aiError);
      // Continue with default category if AI service fails
      console.log('Falling back to default category:', category);
    }

    // Step 4: Save to database
    const { data: dbData, error: dbError } = await supabase
      .from('userwardrobe')
      .insert({
        user_id: userId,
        image_url: publicUrl,
        category: category,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      // Try to clean up the uploaded file
      await supabase.storage.from('userwardrobe').remove([uploadData.path]);
      return NextResponse.json(
        { error: 'Failed to save item to database', details: dbError.message },
        { status: 500 }
      );
    }

    console.log('Item saved to database:', dbData);

    // Step 5: Return response
    return NextResponse.json({
      success: true,
      id: dbData.id,
      image_url: publicUrl,
      category: category,
    });

  } catch (error) {
    console.error('Categorization API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process upload', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
