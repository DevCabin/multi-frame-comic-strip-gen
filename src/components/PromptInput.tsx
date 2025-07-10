import { useState, FormEvent, KeyboardEvent, ChangeEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface PromptInputProps {
  onSubmit: (prompt: string) => Promise<void>;
  isGenerating: boolean;
  placeholder?: string;
}

const PromptInput = ({
  onSubmit,
  isGenerating,
  placeholder = "Describe your scene (e.g., 'A ninja with a cat face standing in a meadow at night...')"
}: PromptInputProps) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    
    await onSubmit(prompt.trim());
    setPrompt('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col space-y-2">
        <textarea
          value={prompt}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isGenerating}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-2 rounded-lg bg-dark-700 text-white placeholder-gray-400 border border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
        />
        <button
          type="submit"
          disabled={!prompt.trim() || isGenerating}
          className="px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Send className="h-5 w-5 mr-2" />
              Generate
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PromptInput; 