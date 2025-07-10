import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (base64: string) => void;
  onClear: () => void;
  accept?: string;
  selectedFile?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onClear,
  accept = "image/*",
  selectedFile
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onFileSelect(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      {selectedFile ? (
        <div className="relative w-full aspect-square rounded-lg overflow-hidden">
          <img
            src={selectedFile}
            alt="Selected reference"
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClear}
            className="absolute top-2 right-2 p-1 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
            title="Remove reference image"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-primary-500 bg-primary-500 bg-opacity-10'
              : 'border-gray-600 hover:border-primary-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 mx-auto text-gray-400" />
          <p className="mt-2 text-sm text-gray-400">
            Drag and drop an image here, or click to select
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default FileUpload; 