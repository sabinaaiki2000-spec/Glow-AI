import React, { useCallback, useState } from 'react';
import { Upload, Camera, ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (file: File) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageSelected(file);
      }
    }
  }, [onImageSelected]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10 p-6 animate-fade-in">
      <div 
        className={`
          relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300
          ${isDragging 
            ? 'border-fuchsia-500 bg-fuchsia-500/10 scale-105' 
            : 'border-slate-700 bg-slate-900/50 hover:border-indigo-400/50 hover:bg-slate-800/50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6 shadow-xl shadow-indigo-900/20 group">
            <Upload className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          
          <h3 className="text-xl font-semibold text-slate-200 mb-2">
            Upload Your Photo
          </h3>
          <p className="text-slate-400 text-sm mb-8 max-w-xs">
            Drag and drop or select a clear, well-lit photo of your face for the best analysis.
          </p>

          <div className="flex gap-4 w-full justify-center">
            <label className="cursor-pointer relative group">
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileInput} 
              />
              <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white font-medium shadow-lg shadow-indigo-500/25 transition-all active:scale-95">
                <ImageIcon className="w-4 h-4" />
                <span>Select Photo</span>
              </div>
            </label>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-fuchsia-500/20 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none"></div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-4">
          Privacy First
        </p>
        <p className="text-xs text-slate-600">
          Your photos are processed privately and are not stored permanently.
        </p>
      </div>
    </div>
  );
};
