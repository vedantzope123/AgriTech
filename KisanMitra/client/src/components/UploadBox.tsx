import React, { useRef } from 'react';
import { Upload, X, FileImage, Camera, Leaf } from 'lucide-react';

interface UploadBoxProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

export default function UploadBox({ onUpload, isLoading }: UploadBoxProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    onUpload(file);
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative rounded-xl border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer overflow-hidden group
        ${isDragging || isLoading
          ? 'border-emerald-500 bg-emerald-50 scale-[1.01] shadow-xl'
          : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30 hover:shadow-lg bg-white'
        } 
      `}
      style={{ minHeight: '350px' }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept="image/*"
        className="hidden"
      />

      {preview && !isLoading && (
        <div className="relative w-full h-full min-h-[350px] animate-fade-in group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover min-h-[350px]"
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
             <p className="text-white font-semibold text-lg drop-shadow-md">Change Image</p>
             <button
              onClick={(e) => { e.stopPropagation(); clearPreview(); }}
              className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-transform hover:scale-110 shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {(!preview || isLoading) && (
        <div
          onClick={() => !isLoading && fileInputRef.current?.click()}
          className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
        >
          {isLoading ? (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                <Leaf className="absolute inset-0 m-auto text-emerald-500 w-8 h-8 animate-pulse" />
              </div>
              <p className="text-xl font-bold text-gray-800 animate-pulse">Analyzing Soil Card...</p>
              <p className="text-sm text-gray-500 mt-2">Extracting chemical parameters & farmer details</p>
            </div>
          ) : (
            <div className="group-hover:scale-105 transition-transform duration-300">
               <div className={`
                 w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center transition-colors duration-300
                 ${isDragging ? 'bg-emerald-200 text-emerald-700' : 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200'}
               `}>
                  <Upload className={`w-12 h-12 ${isDragging ? 'animate-bounce' : ''}`} />
               </div>
               
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {isDragging ? 'Drop it here!' : 'Upload Soil Health Card'}
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-6">
                Drag & drop your card image here, or click to browse files from your device.
              </p>
              
              <div className="flex items-center justify-center gap-4 text-xs text-gray-400 font-medium uppercase tracking-wider">
                 <span className="flex items-center gap-1"><FileImage className="w-4 h-4" /> JPEG, PNG</span>
                 <span className="flex items-center gap-1"><Camera className="w-4 h-4" /> Photo Upload</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
