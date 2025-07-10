import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ComicFrame from './components/ComicFrame';
import EditFrameModal from './components/EditFrameModal';
import { useAuth } from './contexts/AuthContext';
import aiService from './services/aiService';
import storageService from './services/storageService';
import { ComicFrame as ComicFrameType, ComicProject } from './types';
import { Plus } from 'lucide-react';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();  // Keep for future use
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProject, setCurrentProject] = useState<ComicProject | null>(null);
  const [editingFrame, setEditingFrame] = useState<ComicFrameType | null>(null);

  useEffect(() => {
    // Load current project from session storage on mount
    const savedProject = storageService.getCurrentProject();
    if (savedProject) {
      setCurrentProject(savedProject);
    } else {
      // Create new project
      const newProject: ComicProject = {
        id: uuidv4(),
        name: `Comic_${new Date().toISOString().split('T')[0]}`,
        frames: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCurrentProject(newProject);
      storageService.saveCurrentProject(newProject);
    }
  }, []);

  const handleGenerateImage = async (prompt: string) => {
    if (!currentProject) return;

    setIsGenerating(true);
    try {
      const isFirstFrame = currentProject.frames.length === 0;
      const response = await aiService.generateImage({
        prompt,
        referenceImage: isFirstFrame ? undefined : currentProject.baseStyle,
        isFirstFrame,
      });

      if (response.success) {
        const newFrame: ComicFrameType = {
          id: uuidv4(),
          imageUrl: response.imageUrl,
          prompt,
          isFinalized: false,
          createdAt: new Date(),
        };

        const updatedProject = {
          ...currentProject,
          frames: [...currentProject.frames, newFrame],
          updatedAt: new Date(),
        };

        setCurrentProject(updatedProject);
        storageService.saveCurrentProject(updatedProject);
      } else {
        alert('Failed to generate image: ' + response.error);
      }
    } catch (error) {
      console.error('Error generating image:', error);
      alert('An error occurred while generating the image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteFrame = (frameId: string) => {
    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      frames: currentProject.frames.filter(f => f.id !== frameId),
      updatedAt: new Date(),
    };

    setCurrentProject(updatedProject);
    storageService.saveCurrentProject(updatedProject);
  };

  const handleEditFrame = async (frameId: string, newPrompt: string, changeInstructions?: string) => {
    if (!currentProject) return;

    setIsGenerating(true);
    try {
      const frame = currentProject.frames.find(f => f.id === frameId);
      if (!frame) return;

      const response = await aiService.editImage({
        prompt: changeInstructions 
          ? `${newPrompt} [Change Instructions: ${changeInstructions}]`
          : newPrompt,
        referenceImage: frame.imageUrl,
        isFirstFrame: frameId === currentProject.frames[0]?.id,
      });

      if (response.success) {
        const updatedFrames = currentProject.frames.map(f =>
          f.id === frameId
            ? { ...f, imageUrl: response.imageUrl, prompt: newPrompt }
            : f
        );

        const updatedProject = {
          ...currentProject,
          frames: updatedFrames,
          updatedAt: new Date(),
        };

        setCurrentProject(updatedProject);
        storageService.saveCurrentProject(updatedProject);
      } else {
        alert('Failed to edit image: ' + response.error);
      }
    } catch (error) {
      console.error('Error editing image:', error);
      alert('An error occurred while editing the image');
    } finally {
      setIsGenerating(false);
      setEditingFrame(null);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-white">
            {currentProject?.name || 'New Comic Strip'}
          </h2>
        </div>

        {/* Comic Strip Container */}
        <div className="space-y-8">
          {/* Frames */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProject?.frames.map((frame) => (
              <ComicFrame
                key={frame.id}
                frame={frame}
                onDelete={() => handleDeleteFrame(frame.id)}
                onEdit={() => setEditingFrame(frame)}
              />
            ))}
            
            {/* Add Frame Button */}
            <button
              onClick={() => !isGenerating && setEditingFrame({ id: '', imageUrl: '', prompt: '', isFinalized: false, createdAt: new Date() })}
              disabled={isGenerating}
              className="h-64 flex items-center justify-center border-2 border-dashed border-dark-600 rounded-lg hover:border-primary-500 hover:bg-dark-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-8 w-8 text-dark-400" />
            </button>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="mt-8">
          <PromptInput
            onSubmit={handleGenerateImage}
            isGenerating={isGenerating}
          />
        </div>
      </main>

      {/* Edit Frame Modal */}
      {editingFrame && (
        <EditFrameModal
          frame={editingFrame}
          onClose={() => setEditingFrame(null)}
          onSave={handleEditFrame}
          isGenerating={isGenerating}
        />
      )}
    </div>
  );
};

export default App; 