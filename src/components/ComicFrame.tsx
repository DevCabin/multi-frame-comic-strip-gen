import React from 'react';
import { Pencil, Trash } from 'lucide-react';
import { ComicFrame as ComicFrameType } from '../types';

interface ComicFrameProps {
  frame: ComicFrameType;
  onEdit: () => void;
  onDelete: () => void;
}

const ComicFrame: React.FC<ComicFrameProps> = ({
  frame,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="relative group bg-dark-800 rounded-lg overflow-hidden shadow-xl animate-fade-in">
      {/* Frame Image */}
      <div className="aspect-square relative">
        <img
          src={frame.imageUrl}
          alt={frame.prompt}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay with controls */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="p-2 bg-primary-600 rounded-full hover:bg-primary-500 transition-colors"
              title="Edit Frame"
            >
              <Pencil className="h-5 w-5 text-white" />
            </button>
            
            <button
              onClick={onDelete}
              className="p-2 bg-red-600 rounded-full hover:bg-red-500 transition-colors"
              title="Delete Frame"
            >
              <Trash className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Frame Info */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Frame {frame.id}
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-300 line-clamp-2" title={frame.prompt}>
          {frame.prompt}
        </p>
      </div>
    </div>
  );
};

export default ComicFrame; 