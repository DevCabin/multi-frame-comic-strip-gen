import React, { useState } from 'react';
import { X } from 'lucide-react';

interface EditFrameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPrompt: string;
  onSubmit: (newPrompt: string, changeInstructions?: string) => void;
  isProcessing: boolean;
}

const EditFrameModal: React.FC<EditFrameModalProps> = ({
  isOpen,
  onClose,
  currentPrompt,
  onSubmit,
  isProcessing
}) => {
  const [prompt, setPrompt] = useState(currentPrompt);
  const [changeInstructions, setChangeInstructions] = useState('');
  const [editMode, setEditMode] = useState<'refine' | 'change'>('refine');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prompt, editMode === 'change' ? changeInstructions : undefined);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-dark-800 rounded-lg p-6 max-w-2xl w-full mx-4 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Edit Frame</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isProcessing}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Edit Mode Selection */}
          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              onClick={() => setEditMode('refine')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                editMode === 'refine'
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
              }`}
            >
              Refine Prompt
            </button>
            <button
              type="button"
              onClick={() => setEditMode('change')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                editMode === 'change'
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
              }`}
            >
              Specific Changes
            </button>
          </div>

          {/* Prompt Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {editMode === 'refine' ? 'Refined Prompt' : 'Current Prompt'}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-dark-700 text-white placeholder-gray-400 border border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              disabled={isProcessing}
              placeholder={
                editMode === 'refine'
                  ? "Refine your scene description..."
                  : "Your current scene description"
              }
            />
          </div>

          {/* Change Instructions Input */}
          {editMode === 'change' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Change Instructions
              </label>
              <textarea
                value={changeInstructions}
                onChange={(e) => setChangeInstructions(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-dark-700 text-white placeholder-gray-400 border border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
                disabled={isProcessing}
                placeholder="Describe what specific changes you want (e.g., 'Make the moon crescent instead of full')"
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isProcessing || (!prompt.trim() || (editMode === 'change' && !changeInstructions.trim()))}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Apply Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFrameModal; 