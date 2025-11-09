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

interface RecommendationParams {
  files: File[];
  occasion?: string;
  weather?: string;
  num_outfits?: number;
  outfit_style?: string;
  color_preference?: string;
  fit_preference?: string;
  material_preference?: string;
  season?: string;
  time_of_day?: string;
  budget?: string;
  personal_style?: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract files - multiple wardrobe images
    const filesInput = formData.getAll('files') as File[];
    console.log(`Received ${filesInput.length} files from client`);
    
    if (!filesInput || filesInput.length === 0) {
      return NextResponse.json(
        { error: 'At least one wardrobe image is required' },
        { status: 400 }
      );
    }

    if (filesInput.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 wardrobe images are required to generate outfit recommendations' },
        { status: 400 }
      );
    }

    // Log file details
    filesInput.forEach((file, index) => {
      console.log(`File ${index + 1}: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);
    });

    // Extract parameters with defaults
    const occasion = (formData.get('occasion') as string) || 'casual';
    const weather = (formData.get('weather') as string) || 'any';
    const num_outfits = parseInt((formData.get('num_outfits') as string) || '3');
    const outfit_style = (formData.get('outfit_style') as string) || 'casual';
    const color_preference = (formData.get('color_preference') as string) || 'None';
    const fit_preference = (formData.get('fit_preference') as string) || 'None';
    const material_preference = (formData.get('material_preference') as string) || 'None';
    const season = (formData.get('season') as string) || 'None';
    const time_of_day = (formData.get('time_of_day') as string) || 'None';
    const budget = (formData.get('budget') as string) || 'None';
    const personal_style = (formData.get('personal_style') as string) || 'None';

    console.log('Connecting to Gradio recommendation API...');
    
    // Connect to Gradio client
    let client;
    try {
      client = await Client.connect("Stylique/recomendation");
    } catch (error) {
      console.error('Failed to connect to Gradio client:', error);
      return NextResponse.json(
        { error: 'Recommendation service is temporarily unavailable' },
        { status: 503 }
      );
    }

    // Convert Files for Gradio
    // Gradio requires files with proper extensions and MIME types
    // We need to ensure all files have valid extensions (.jpg, .jpeg, .png, etc.)
    console.log(`Preparing ${filesInput.length} files for Gradio API...`);
    
    // Validate and fix file extensions/MIME types
    // Gradio strictly checks file extensions, so we must ensure all files have valid extensions
    const validatedFiles = await Promise.all(
      filesInput.map(async (file, index) => {
        const fileName = file.name.toLowerCase();
        const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff', '.tif'];
        
        // Extract current extension (handle files with no extension or query params)
        const lastDotIndex = fileName.lastIndexOf('.');
        const questionMarkIndex = fileName.indexOf('?');
        const endIndex = questionMarkIndex > 0 ? questionMarkIndex : fileName.length;
        const currentExt = lastDotIndex > 0 && lastDotIndex < endIndex 
          ? fileName.substring(lastDotIndex, endIndex) 
          : '';
        const hasValidExtension = currentExt && validExtensions.includes(currentExt);
        
        // Check MIME type
        const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff'];
        const fileMimeType = (file.type || '').toLowerCase();
        const hasValidMimeType = validMimeTypes.includes(fileMimeType) || fileMimeType.startsWith('image/');
        
        console.log(`File ${index + 1}: name="${file.name}", type="${file.type}", ext="${currentExt}", validExt=${hasValidExtension}, validMime=${hasValidMimeType}`);
        
        // If file is already valid, return as-is
        if (hasValidExtension && hasValidMimeType) {
          return file;
        }
        
        // Determine correct extension and MIME type
        let extension = 'jpg';
        let mimeType = 'image/jpeg';
        
        // Priority: check MIME type first, then filename
        if (fileMimeType.includes('png')) {
          extension = 'png';
          mimeType = 'image/png';
        } else if (fileMimeType.includes('webp')) {
          extension = 'webp';
          mimeType = 'image/webp';
        } else if (fileMimeType.includes('gif')) {
          extension = 'gif';
          mimeType = 'image/gif';
        } else if (fileMimeType.includes('bmp')) {
          extension = 'bmp';
          mimeType = 'image/bmp';
        } else if (fileMimeType.includes('tiff') || fileMimeType.includes('tif')) {
          extension = 'tiff';
          mimeType = 'image/tiff';
        } else if (fileName.endsWith('.png')) {
          extension = 'png';
          mimeType = 'image/png';
        } else if (fileName.endsWith('.webp')) {
          extension = 'webp';
          mimeType = 'image/webp';
        } else if (fileName.endsWith('.gif')) {
          extension = 'gif';
          mimeType = 'image/gif';
        } else {
          // Default to jpg/jpeg (most common)
          extension = 'jpg';
          mimeType = 'image/jpeg';
        }
        
        // Create new file with correct extension and MIME type
        const arrayBuffer = await file.arrayBuffer();
        const baseName = file.name.replace(/\.[^.]+$/, '') || `file_${index + 1}`;
        const fixedFileName = `${baseName}.${extension}`;
        const fixedFile = new File([arrayBuffer], fixedFileName, { type: mimeType });
        
        console.log(`Fixed file ${index + 1}: "${file.name}" -> "${fixedFileName}" (${mimeType})`);
        return fixedFile;
      })
    );
    
    // Keep files as File objects - Gradio needs filenames with extensions
    // Converting to Blobs loses the filename/extension, causing "unsupported format" errors
    // The validated files already have correct extensions (.jpg, .png, etc.)
    console.log(`Prepared ${validatedFiles.length} files with extensions for Gradio API...`);
    validatedFiles.forEach((file, index) => {
      console.log(`File ${index + 1}: "${file.name}" (${file.type}, ${file.size} bytes)`);
    });
    
    // For multiple files, pass as array of Files
    // Gradio client accepts File objects which preserve the filename/extension
    const filesParam = validatedFiles.length === 1 ? validatedFiles[0] : validatedFiles;
    
    let result;
    try {
      
      const predictionResult = await Promise.race([
        client.predict("/gradio_recommend", {
          files: filesParam,
          occasion: occasion,
          weather: weather,
          num_outfits: num_outfits,
          outfit_style: outfit_style,
          color_preference: color_preference === 'None' ? null : color_preference,
          fit_preference: fit_preference === 'None' ? null : fit_preference,
          material_preference: material_preference === 'None' ? null : material_preference,
          season: season === 'None' ? null : season,
          time_of_day: time_of_day === 'None' ? null : time_of_day,
          budget: budget === 'None' ? null : budget,
          personal_style: personal_style === 'None' ? null : personal_style,
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout after 3 minutes')), 180000) // 3 minutes timeout (API can take 2-5 seconds per outfit)
        )
      ]);
      result = predictionResult;
    } catch (error) {
      console.error('Gradio prediction failed:', error);
      return NextResponse.json(
        { error: 'Recommendation request failed or timed out', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 503 }
      );
    }

    console.log('Gradio API Response received');
    console.log('Response structure:', {
      hasData: !!result?.data,
      dataType: Array.isArray(result?.data) ? 'array' : typeof result?.data,
      dataLength: Array.isArray(result?.data) ? result.data.length : 'N/A',
      firstElementType: Array.isArray(result?.data) && result.data.length > 0 ? typeof result.data[0] : 'N/A',
      firstElementPreview: Array.isArray(result?.data) && result.data.length > 0 
        ? (typeof result.data[0] === 'object' ? JSON.stringify(result.data[0]).substring(0, 200) : String(result.data[0]).substring(0, 200))
        : 'N/A'
    });

    // Handle the response - should be array with 2 elements
    if (result && result.data && Array.isArray(result.data) && result.data.length >= 2) {
      // Extract outfit images from Gallery (first element)
      const extractImageUrls = (galleryData: unknown): string[] => {
        const urls: string[] = [];
        
        try {
          console.log('Extracting image URLs from gallery data:', {
            type: typeof galleryData,
            isArray: Array.isArray(galleryData),
            length: Array.isArray(galleryData) ? galleryData.length : 'N/A',
            firstItemType: Array.isArray(galleryData) && galleryData.length > 0 ? typeof galleryData[0] : 'N/A',
            firstItemPreview: Array.isArray(galleryData) && galleryData.length > 0 
              ? (typeof galleryData[0] === 'object' ? JSON.stringify(galleryData[0]).substring(0, 300) : String(galleryData[0]).substring(0, 300))
              : 'N/A'
          });
          
          // If it's an array of images
          if (Array.isArray(galleryData)) {
            galleryData.forEach((item, index) => {
              console.log(`Processing gallery item ${index + 1}:`, {
                type: typeof item,
                isString: typeof item === 'string',
                isObject: typeof item === 'object' && item !== null,
                preview: typeof item === 'string' ? item.substring(0, 100) : typeof item === 'object' ? JSON.stringify(item).substring(0, 200) : String(item).substring(0, 100)
              });
              
              if (typeof item === 'string') {
                // Check if it's a URL
                if (item.startsWith('http')) {
                  urls.push(item);
                  console.log(`Added URL from string: ${item.substring(0, 100)}`);
                } else if (item.startsWith('data:image')) {
                  // Base64 encoded image - convert to data URL
                  urls.push(item);
                  console.log(`Added base64 image data URL`);
                } else if (item.includes('/tmp/') || item.includes('gradio')) {
                  // This is a file path - Gradio should have converted it to a URL
                  // Log it for debugging but don't add it (we need the URL, not the path)
                  console.warn(`Received file path as string (Gradio should have provided URL): ${item.substring(0, 100)}`);
                } else {
                  console.warn(`String item doesn't look like URL, base64, or file path: ${item.substring(0, 50)}`);
                }
              } else if (item && typeof item === 'object') {
                // Gradio FileData format - can be nested or flat
                const fileData = item as any;
                console.log(`FileData object keys:`, Object.keys(fileData));
                
                // Check for nested structure: { image: { url: "...", path: "..." }, caption: "..." }
                let imageData = fileData;
                if ('image' in fileData && typeof fileData.image === 'object' && fileData.image !== null) {
                  console.log(`Found nested image structure, extracting from image property`);
                  imageData = fileData.image;
                }
                
                // Now check for url or path in imageData
                if ('url' in imageData && typeof imageData.url === 'string') {
                  const url = imageData.url;
                  if (url.startsWith('http')) {
                    urls.push(url);
                    console.log(`Added URL from FileData.url: ${url.substring(0, 100)}`);
                  } else {
                    console.warn(`FileData.url is not HTTP URL: ${url.substring(0, 50)}`);
                  }
                } else if ('path' in imageData && typeof imageData.path === 'string') {
                  // Gradio sometimes returns paths instead of URLs
                  // For Hugging Face Spaces, try to construct URL from path
                  const path = imageData.path;
                  console.log(`Received file path: ${path}`);
                  
                  // If it's a Gradio temp file, Gradio should have converted it to a URL
                  // But if we only have a path, try to construct the Space URL
                  if (path.includes('/tmp/') || path.includes('gradio')) {
                    // For Hugging Face Spaces, files are typically served via the Space URL
                    // The path might need to be converted by Gradio, but if it's not,
                    // we can try constructing the URL (this may not always work)
                    const spaceUrl = 'https://stylique-recomendation.hf.space'; // Update if needed
                    // Note: This is a fallback - Gradio should provide the URL
                    console.warn('Received local path, Gradio should have provided URL. Path:', path);
                  } else {
                    console.warn('Received local path, cannot access:', path);
                  }
                } else {
                  console.warn(`FileData object missing url or path. Available keys:`, Object.keys(imageData));
                  console.warn(`Full fileData structure:`, JSON.stringify(fileData).substring(0, 500));
                }
              } else {
                console.warn(`Unexpected item type in gallery: ${typeof item}`);
              }
            });
          } else if (typeof galleryData === 'string' && galleryData.startsWith('http')) {
            // Single image URL
            urls.push(galleryData);
            console.log(`Added single URL: ${galleryData.substring(0, 100)}`);
          } else if (galleryData && typeof galleryData === 'object') {
            // Single FileData object
            const fileData = galleryData as any;
            if ('url' in fileData && typeof fileData.url === 'string') {
              const url = fileData.url;
              if (url.startsWith('http')) {
                urls.push(url);
                console.log(`Added URL from single FileData: ${url.substring(0, 100)}`);
              }
            } else {
              console.warn('Single FileData object missing url property:', Object.keys(fileData));
            }
          } else {
            console.warn(`Unexpected gallery data type: ${typeof galleryData}`);
          }
        } catch (error) {
          console.error('Error extracting image URLs:', error);
        }
        
        console.log(`Extracted ${urls.length} image URLs from gallery data`);
        return urls;
      };

      // Extract outfit details JSON (second element)
      const extractOutfitDetails = (jsonData: unknown): unknown => {
        try {
          if (typeof jsonData === 'string') {
            return JSON.parse(jsonData);
          } else if (jsonData && typeof jsonData === 'object') {
            return jsonData;
          }
          return null;
        } catch (error) {
          console.error('Error parsing outfit details:', error);
          return null;
        }
      };

      const outfitImages = extractImageUrls(result.data[0]);
      const outfitDetails = extractOutfitDetails(result.data[1]);

      if (outfitImages.length === 0) {
        return NextResponse.json(
          { error: 'No outfit images returned from API' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          outfitImages,
          outfitDetails,
        }
      });
    } else {
      console.error('Invalid response format:', result);
      return NextResponse.json(
        { error: 'Invalid response format from API' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Recommendation API error:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

