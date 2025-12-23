import { ParsedAnalysis } from './types';

// Resize and compress image to avoid payload size limits (fixes XHR/RPC errors)
export const compressImage = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const MAX_WIDTH = 1024;
        const MAX_HEIGHT = 1024;
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        // Always convert to JPEG for better compression and consistency with API expectations
        const mimeType = 'image/jpeg';
        const quality = 0.8;
        const dataUrl = canvas.toDataURL(mimeType, quality);
        
        resolve({
          base64: dataUrl.split(',')[1],
          mimeType
        });
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const parseAnalysisResult = (text: string): ParsedAnalysis => {
  // Helper to extract content between headers
  const extractSection = (startMarker: string, endMarker?: string) => {
    const startIndex = text.indexOf(startMarker);
    if (startIndex === -1) return '';
    
    const contentStart = startIndex + startMarker.length;
    
    if (endMarker) {
      const endIndex = text.indexOf(endMarker, contentStart);
      if (endIndex === -1) return text.slice(contentStart).trim();
      return text.slice(contentStart, endIndex).trim();
    }
    
    return text.slice(contentStart).trim();
  };

  return {
    analysisSummary: extractSection('1. Photo Analysis Summary', '2. Key Enhancement Opportunities'),
    enhancementOpportunities: extractSection('2. Key Enhancement Opportunities', '3. AI-Enhanced Beauty Goal Description'),
    visualDescription: extractSection('3. AI-Enhanced Beauty Goal Description', '4. Personalized Transformation Plan'),
    transformationPlan: extractSection('4. Personalized Transformation Plan', '5. Motivational Closing'),
    motivationalClosing: extractSection('5. Motivational Closing'),
    rawText: text
  };
};