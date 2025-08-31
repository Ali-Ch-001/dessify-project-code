import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@gradio/client';

interface GradioFileData {
  path: string;
  url: string;
  size: number | null;
  orig_name: string;
  mime_type: string | null;
  is_stream: boolean;
  meta: {
    _type: string;
  };
}

interface GradioResponse {
  data: (string | GradioFileData)[];
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    console.log('Processing image:', imageFile.name, 'Size:', imageFile.size);

    // Convert File to Blob for Gradio client
    const imageBlob = new Blob([await imageFile.arrayBuffer()], { type: imageFile.type });

    console.log('Connecting to Gradio client...');
    
    // Connect to the user's custom space with better error handling
    let client;
    try {
      client = await Client.connect("https://stylique-background-remover.hf.space");
    } catch (error) {
      console.error('Failed to connect to Gradio client:', error);
      return NextResponse.json(
        { error: 'Background removal service is temporarily unavailable' },
        { status: 503 }
      );
    }
    
    console.log('Making prediction with /predict endpoint...');
    
    // Use the /predict endpoint with timeout and retry
    let result: GradioResponse | null = null;
    try {
      const predictionResult = await Promise.race([
        client.predict("/predict", { 
          input_image: imageBlob, 
        }) as Promise<GradioResponse>,
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 30000)
        )
      ]);
      result = predictionResult;
    } catch (error) {
      console.error('Gradio prediction failed:', error);
      return NextResponse.json(
        { error: 'Background removal request failed or timed out' },
        { status: 503 }
      );
    }

    console.log('Gradio API Response:', JSON.stringify(result, null, 2));

    // Handle the response - the documentation says it returns a string
    if (result && result.data && Array.isArray(result.data) && result.data.length > 0) {
      const processedImageData = result.data[0];
      
      console.log('Processed image data type:', typeof processedImageData);
      console.log('Processed image data:', processedImageData);
      
      let imageUrl: string;

      if (typeof processedImageData === 'string') {
        // Direct URL or base64
        imageUrl = processedImageData;
      } else if (typeof processedImageData === 'object' && processedImageData !== null) {
        const fileData = processedImageData as GradioFileData;
        console.log('Processing Gradio FileData object with URL');
        imageUrl = fileData.url;
      } else {
        throw new Error('Unexpected response format from Gradio API');
      }

      if (imageUrl.startsWith('http')) {
        console.log('Fetching image from URL:', imageUrl);
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch processed image: ${imageResponse.status}`);
        }
        const imageBuffer = await imageResponse.arrayBuffer();
        
        return new NextResponse(imageBuffer, {
          headers: {
            'Content-Type': 'image/png',
            'Content-Disposition': `attachment; filename="${imageFile.name.replace(/\.[^/.]+$/, '_nobg.png')}"`,
          },
        });
      } else {
        // If it's a base64 string, decode and return
        console.log('Processing base64 image data');
        const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');
        
        return new NextResponse(imageBuffer, {
          headers: {
            'Content-Type': 'image/png',
            'Content-Disposition': `attachment; filename="${imageFile.name.replace(/\.[^/.]+$/, '_nobg.png')}"`,
          },
        });
      }
    }

    console.log('No valid image data found in result');
    return NextResponse.json(
      { error: 'Failed to process image - no valid data returned' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Background removal error:', error);
    return NextResponse.json(
      { error: 'Failed to remove background', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
