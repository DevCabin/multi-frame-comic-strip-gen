export interface ComicFrame {
  id: string;
  imageUrl: string;
  prompt: string;
  isFinalized: boolean;
  createdAt: Date;
  styleReference?: string; // Base64 of the reference image for style consistency
}

export interface ComicProject {
  id: string;
  name: string;
  frames: ComicFrame[];
  baseStyle?: string; // Style reference from the first frame
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerationRequest {
  prompt: string;
  referenceImage?: string; // Base64 image for style consistency
  isFirstFrame: boolean;
}

export interface GenerationResponse {
  imageUrl: string;
  success: boolean;
  error?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export type AppState = 'idle' | 'generating' | 'editing' | 'finalizing'; 