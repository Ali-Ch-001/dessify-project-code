import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, Content, Part } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, message, conversationHistory, bodyFeatures, outfitRequestParams } = await request.json();

    const apiKey = process.env.GOOGLE_API_KEY;
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google API key not configured' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    // If this is the first message, we need to send the image
    if (imageUrl && (!conversationHistory || conversationHistory.length === 0)) {
      // Fetch the image and convert to base64
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error('Failed to fetch image');
      }
      
      const imageBuffer = await imageResponse.arrayBuffer();
      const imageBase64 = Buffer.from(imageBuffer).toString('base64');
      
      // Determine MIME type from URL or default to jpeg
      let mimeType = 'image/jpeg';
      const urlLower = imageUrl.toLowerCase();
      if (urlLower.includes('.png')) {
        mimeType = 'image/png';
      } else if (urlLower.includes('.webp')) {
        mimeType = 'image/webp';
      } else if (urlLower.includes('.gif')) {
        mimeType = 'image/gif';
      }

      // Build outfit request context
      let outfitRequestText = '';
      if (outfitRequestParams) {
        const requestDetails: string[] = [];
        if (outfitRequestParams.occasion) requestDetails.push(`Occasion: ${outfitRequestParams.occasion}`);
        if (outfitRequestParams.weather) requestDetails.push(`Weather: ${outfitRequestParams.weather}`);
        if (outfitRequestParams.outfit_style) requestDetails.push(`Outfit Style: ${outfitRequestParams.outfit_style}`);
        
        if (requestDetails.length > 0) {
          outfitRequestText = `\n\nThis outfit was recommended based on the following requirements:\n${requestDetails.join('\n')}\n\n`;
        }
      }

      // Build body features description
      let bodyFeaturesText = '';
      if (bodyFeatures) {
        const features: string[] = [];
        if (bodyFeatures.gender) features.push(`Gender: ${bodyFeatures.gender}`);
        if (bodyFeatures.body_type) features.push(`Body type: ${bodyFeatures.body_type}`);
        if (bodyFeatures.hair_type) features.push(`Hair type: ${bodyFeatures.hair_type}`);
        if (bodyFeatures.hair_color) features.push(`Hair color: ${bodyFeatures.hair_color}`);
        if (bodyFeatures.eyeball_color) features.push(`Eye color: ${bodyFeatures.eyeball_color}`);
        if (bodyFeatures.glasses !== null) features.push(`Wears glasses: ${bodyFeatures.glasses ? 'Yes' : 'No'}`);
        if (bodyFeatures.skin_tone) features.push(`Skin tone: ${bodyFeatures.skin_tone}`);
        
        if (features.length > 0) {
          bodyFeaturesText = `\n\nUser's body features:\n${features.join('\n')}\n\nPlease consider these features when analyzing the outfit and providing recommendations. Consider how the outfit complements or works with these physical characteristics.`;
        }
      }

      const initialPrompt = `Please scan and understand the outfit in this image, so I can talk about it. Analyze the clothing items, colors, style, and overall aesthetic. Be ready to answer questions about this outfit.${outfitRequestText}${bodyFeaturesText}`;

      const result = await model.generateContent([
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        },
        initialPrompt,
      ]);

      const response = await result.response;
      const text = response.text();

      return NextResponse.json({
        success: true,
        message: text,
      });
    } else {
      // Continue conversation
      // If we have an imageUrl, we need to include it in the history
      // Build history from conversationHistory
      let history: Content[] = [];
      
      // If imageUrl is provided and we have conversation history, reconstruct full history with image
      if (imageUrl && conversationHistory && conversationHistory.length > 0) {
        // Fetch the image and convert to base64 for history
        try {
          const imageResponse = await fetch(imageUrl);
          if (imageResponse.ok) {
            const imageBuffer = await imageResponse.arrayBuffer();
            const imageBase64 = Buffer.from(imageBuffer).toString('base64');
            
            let mimeType = 'image/jpeg';
            const urlLower = imageUrl.toLowerCase();
            if (urlLower.includes('.png')) {
              mimeType = 'image/png';
            } else if (urlLower.includes('.webp')) {
              mimeType = 'image/webp';
            } else if (urlLower.includes('.gif')) {
              mimeType = 'image/gif';
            }

            // Build outfit request context
            let outfitRequestText = '';
            if (outfitRequestParams) {
              const requestDetails: string[] = [];
              if (outfitRequestParams.occasion) requestDetails.push(`Occasion: ${outfitRequestParams.occasion}`);
              if (outfitRequestParams.weather) requestDetails.push(`Weather: ${outfitRequestParams.weather}`);
              if (outfitRequestParams.outfit_style) requestDetails.push(`Outfit Style: ${outfitRequestParams.outfit_style}`);
              
              if (requestDetails.length > 0) {
                outfitRequestText = `\n\nThis outfit was recommended based on the following requirements:\n${requestDetails.join('\n')}\n\n`;
              }
            }

            // Build body features description for initial prompt
            let bodyFeaturesText = '';
            if (bodyFeatures) {
              const features: string[] = [];
              if (bodyFeatures.gender) features.push(`Gender: ${bodyFeatures.gender}`);
              if (bodyFeatures.body_type) features.push(`Body type: ${bodyFeatures.body_type}`);
              if (bodyFeatures.hair_type) features.push(`Hair type: ${bodyFeatures.hair_type}`);
              if (bodyFeatures.hair_color) features.push(`Hair color: ${bodyFeatures.hair_color}`);
              if (bodyFeatures.eyeball_color) features.push(`Eye color: ${bodyFeatures.eyeball_color}`);
              if (bodyFeatures.glasses !== null) features.push(`Wears glasses: ${bodyFeatures.glasses ? 'Yes' : 'No'}`);
              if (bodyFeatures.skin_tone) features.push(`Skin tone: ${bodyFeatures.skin_tone}`);
              
              if (features.length > 0) {
                bodyFeaturesText = `\n\nUser's body features:\n${features.join('\n')}\n\nPlease consider these features when analyzing the outfit and providing recommendations. Consider how the outfit complements or works with these physical characteristics.`;
              }
            }

            const initialPrompt = `Please scan and understand the outfit in this image, so I can talk about it. Analyze the clothing items, colors, style, and overall aesthetic. Be ready to answer questions about this outfit.${outfitRequestText}${bodyFeaturesText}`;

            // Add initial user message with image
            history.push({
              role: 'user',
              parts: [
                {
                  inlineData: {
                    data: imageBase64,
                    mimeType: mimeType,
                  },
                },
                { text: initialPrompt },
              ] as Part[],
            });

            // Add the assistant's initial response (first message in history)
            if (conversationHistory.length > 0 && conversationHistory[0].role === 'assistant') {
              const assistantContent = typeof conversationHistory[0].parts === 'string' 
                ? conversationHistory[0].parts 
                : String(conversationHistory[0].parts);
              history.push({
                role: 'model',
                parts: [{ text: assistantContent }],
              } as Content);
            }

            // Add remaining conversation history
            for (let i = 1; i < conversationHistory.length; i++) {
              const msg = conversationHistory[i];
              const content = typeof msg.parts === 'string' ? msg.parts : String(msg.parts);
              history.push({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: content }],
              } as Content);
            }
          }
        } catch (imageError) {
          console.error('Error fetching image for history:', imageError);
          // Fallback to text-only history
          history = conversationHistory.map((msg: { role: string; parts: string }): Content => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: typeof msg.parts === 'string' ? msg.parts : String(msg.parts) }],
          } as Content));
        }
      } else {
        // No image URL, just use text history
        history = conversationHistory?.map((msg: { role: string; parts: string }): Content => {
          const role = msg.role === 'user' ? 'user' : 'model';
          return {
            role,
            parts: [{ text: typeof msg.parts === 'string' ? msg.parts : String(msg.parts) }],
          } as Content;
        }) || [];
      }

      try {
        const chat = model.startChat({
          history: history,
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({
          success: true,
          message: text,
        });
      } catch (chatError) {
        console.error('Error in chat continuation:', chatError);
        throw chatError;
      }
    }
  } catch (error) {
    console.error('Error in Gemini chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

