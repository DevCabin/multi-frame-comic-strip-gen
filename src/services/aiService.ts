import { GenerationRequest, GenerationResponse } from '../types';

export class AIService {
  private static instance: AIService;
  private apiKey: string;
  private model: string;
  
  private constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || '';
    // Default to DALL-E 2 for development - using exact model name required by API
    this.model = process.env.REACT_APP_OPENAI_MODEL || 'dall-e-2';
  }
  
  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async generateImage(request: GenerationRequest): Promise<GenerationResponse> {
    if (!this.apiKey) {
      return {
        imageUrl: '',
        success: false,
        error: 'OpenAI API key not configured'
      };
    }

    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'dall-e-2', // Hardcode the model name to ensure correct format
          prompt: request.prompt,
          n: 1,
          // Default to 512x512 for development
          size: '512x512',
          response_format: 'url',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to generate image');
      }

      const data = await response.json();
      return {
        imageUrl: data.data[0].url,
        success: true
      };
    } catch (error) {
      console.error('Error generating image:', error);
      return {
        imageUrl: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async editImage(request: GenerationRequest): Promise<GenerationResponse> {
    if (!this.apiKey) {
      return {
        imageUrl: '',
        success: false,
        error: 'OpenAI API key not configured'
      };
    }

    try {
      // For DALL-E 2, we'll generate a new image with the modified prompt
      // since variations API has different requirements
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'dall-e-2', // Hardcode the model name to ensure correct format
          prompt: request.prompt,
          n: 1,
          // Default to 512x512 for development
          size: '512x512',
          response_format: 'url',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to edit image');
      }

      const data = await response.json();
      return {
        imageUrl: data.data[0].url,
        success: true
      };
    } catch (error) {
      console.error('Error editing image:', error);
      return {
        imageUrl: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export default AIService.getInstance(); 