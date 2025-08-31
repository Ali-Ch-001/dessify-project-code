import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@gradio/client';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const personImage = formData.get('personImage') as File;
    const garmentImage = formData.get('garmentImage') as File;
    const refAcceleration = formData.get('refAcceleration') === 'true';
    const step = parseInt(formData.get('step') as string);
    const scale = parseFloat(formData.get('scale') as string);
    const seed = parseInt(formData.get('seed') as string);
    const vtModelType = formData.get('vtModelType') as string;
    const vtGarmentType = formData.get('vtGarmentType') as string;
    const vtRepaint = formData.get('vtRepaint') === 'true';

    if (!personImage || !garmentImage) {
      return NextResponse.json(
        { error: 'Both person and garment images are required' },
        { status: 400 }
      );
    }

    // Convert File to Buffer for Gradio client
    const personBuffer = Buffer.from(await personImage.arrayBuffer());
    const garmentBuffer = Buffer.from(await garmentImage.arrayBuffer());

    const client = await Client.connect("Stylique/2D-Try-On");
    const result = await client.predict("/leffa_predict_vt", {
      src_image_path: personBuffer,
      ref_image_path: garmentBuffer,
      ref_acceleration: refAcceleration,
      step: step,
      scale: scale,
      seed: seed,
      vt_model_type: vtModelType,
      vt_garment_type: vtGarmentType,
      vt_repaint: vtRepaint,
    });

    console.log('Gradio API Response:', JSON.stringify(result, null, 2));

    if (result.data && Array.isArray(result.data) && result.data.length >= 3) {
      // Handle the response data - extract URLs from Gradio response
      const extractImageUrl = (item: unknown): string | null => {
        try {
          // If it's already a string URL, return as-is
          if (typeof item === 'string') {
            return item.startsWith('http') ? item : null;
          }
          
          // If it's an object with a url property (Gradio FileData), use that
          if (item && typeof item === 'object' && 'url' in item && typeof (item as { url: unknown }).url === 'string') {
            return (item as { url: string }).url;
          }
          
          // If it's an object with a path property, try to construct URL
          if (item && typeof item === 'object' && 'path' in item && typeof (item as { path: unknown }).path === 'string') {
            // For local paths, we can't access them from the client
            // So we'll return null and handle the error
            return null;
          }
          
          return null;
        } catch (error) {
          console.error('Error extracting image URL:', error);
          return null;
        }
      };

      const [generatedImage, generatedMask, generatedDensePose] = [
        extractImageUrl(result.data[0]),
        extractImageUrl(result.data[1]),
        extractImageUrl(result.data[2])
      ];

      return NextResponse.json({
        success: true,
        data: {
          generatedImage,
          generatedMask,
          generatedDensePose,
        }
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid response from API' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in try-on API:', error);
    return NextResponse.json(
      { error: 'Failed to process images' },
      { status: 500 }
    );
  }
}
