import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, params } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Get authorization header (Bearer token)
    const authHeader = request.headers.get('authorization');
    
    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    // Create Supabase client with auth header if provided
    const supabase = authHeader 
      ? createClient(supabaseUrl, supabaseAnonKey, {
          global: {
            headers: {
              Authorization: authHeader,
            },
          },
        })
      : createClient(supabaseUrl, supabaseAnonKey);

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: 'Unauthorized', details: authError?.message || 'No user session found' },
        { status: 401 }
      );
    }

    // Fetch the image from the URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image');
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBlob = new Blob([imageBuffer]);
    
    // Determine file extension from URL or content type
    let extension = 'jpg';
    const urlLower = imageUrl.toLowerCase();
    if (urlLower.includes('.png')) {
      extension = 'png';
    } else if (urlLower.includes('.webp')) {
      extension = 'webp';
    } else if (urlLower.includes('.gif')) {
      extension = 'gif';
    }

    // Create a File object
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${extension}`;
    const filePath = `${user.id}/${fileName}`;
    const file = new File([imageBlob], fileName, { 
      type: imageResponse.headers.get('content-type') || 'image/jpeg' 
    });

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('styled-looks')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('styled-looks')
      .getPublicUrl(filePath);

    // Save metadata to database
    const { data, error: dbError } = await supabase
      .from('styled_looks')
      .insert({
        user_id: user.id,
        image_url: publicUrl,
        occasion: params?.occasion || null,
        weather: params?.weather || null,
        outfit_style: params?.outfit_style || null,
        color_preference: params?.color_preference || null,
        fit_preference: params?.fit_preference || null,
        material_preference: params?.material_preference || null,
        season: params?.season || null,
        time_of_day: params?.time_of_day || null,
        budget: params?.budget || null,
        personal_style: params?.personal_style || null,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Try to delete the uploaded file if database insert fails
      await supabase.storage
        .from('styled-looks')
        .remove([filePath]);
      
      throw new Error(`Failed to save to database: ${dbError.message}`);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        image_url: publicUrl,
        created_at: data.created_at,
      },
    });
  } catch (error) {
    console.error('Error saving styled look:', error);
    return NextResponse.json(
      { 
        error: 'Failed to save styled look', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

