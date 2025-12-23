
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { UserTier } from '../types';

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing. Please set process.env.API_KEY");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

export const analyzeImage = async (base64Image: string, tier: UserTier): Promise<string> => {
  const ai = getClient();
  
  // Adjust the prompt based on tier
  const userPrompt = tier === UserTier.PREMIUM
    ? "full_report"
    : "full_report. IMPORTANT: Since this is a FREE tier user, provide a SHORT condensed 7-day plan instead of 30 days. Keep analysis basic.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: userPrompt
          }
        ]
      }
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const generateEnhancedImage = async (originalBase64: string, prompt: string): Promise<string> => {
  const ai = getClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
           {
            inlineData: {
              mimeType: 'image/jpeg',
              data: originalBase64
            }
          },
          {
            text: `Generate a clearly transformed glow-up version of the user with obvious beauty enhancements while maintaining identity and realism.

Specific Goal based on analysis: ${prompt}

Enhancements to apply:
- Flawless glowing skin with natural luminosity
- Zero acne or texture; smooth but realistic skin
- Enhanced facial symmetry
- Sharper, defined jawline and sculpted cheekbones
- Bright, clear, expressive eyes; enhanced lashes
- Perfectly shaped eyebrows
- Fuller, healthier, voluminous hair
- Subtle makeup effect: soft contour, natural glam, warm tones
- Improved lighting and background aesthetic for beauty photography style

Make the transformation dramatic but still realistic and respectful to natural features.

Do NOT:
- Change facial identity
- Lighten skin tone
- Alter ethnicity
- Create exaggerated features
- Make the result look AI-generated

Aim for a stunning, magazine-quality glow-up.`
          }
        ]
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated");
  } catch (error) {
    console.error("Image generation failed:", error);
    throw error;
  }
};
