import { ComicProject, ComicFrame } from '../types';

export class StorageService {
  private static instance: StorageService;
  
  private constructor() {}
  
  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Local Storage Methods
  private getLocalProjects(): ComicProject[] {
    const projectsJson = localStorage.getItem('comicProjects');
    return projectsJson ? JSON.parse(projectsJson) : [];
  }

  private saveLocalProjects(projects: ComicProject[]): void {
    localStorage.setItem('comicProjects', JSON.stringify(projects));
  }

  async saveProject(project: ComicProject): Promise<void> {
    const projects = this.getLocalProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    if (existingIndex >= 0) {
      projects[existingIndex] = project;
    } else {
      projects.push(project);
    }
    
    this.saveLocalProjects(projects);
  }

  async getProject(projectId: string): Promise<ComicProject | null> {
    const projects = this.getLocalProjects();
    return projects.find(p => p.id === projectId) || null;
  }

  async listProjects(): Promise<ComicProject[]> {
    return this.getLocalProjects();
  }

  async deleteProject(projectId: string): Promise<void> {
    const projects = this.getLocalProjects();
    const filteredProjects = projects.filter(p => p.id !== projectId);
    this.saveLocalProjects(filteredProjects);
  }

  // Session Storage Methods for current project
  saveCurrentProject(project: ComicProject): void {
    sessionStorage.setItem('currentProject', JSON.stringify(project));
  }

  getCurrentProject(): ComicProject | null {
    const projectJson = sessionStorage.getItem('currentProject');
    return projectJson ? JSON.parse(projectJson) : null;
  }

  clearCurrentProject(): void {
    sessionStorage.removeItem('currentProject');
  }

  // Frame Management
  saveFrame(projectId: string, frame: ComicFrame): Promise<void> {
    const projects = this.getLocalProjects();
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
      const frameIndex = project.frames.findIndex(f => f.id === frame.id);
      if (frameIndex >= 0) {
        project.frames[frameIndex] = frame;
      } else {
        project.frames.push(frame);
      }
      
      this.saveLocalProjects(projects);
    }
    
    return Promise.resolve();
  }

  // Base style reference management
  saveBaseStyle(projectId: string, styleReference: string): void {
    const key = `baseStyle_${projectId}`;
    sessionStorage.setItem(key, styleReference);
  }

  getBaseStyle(projectId: string): string | null {
    const key = `baseStyle_${projectId}`;
    return sessionStorage.getItem(key);
  }
}

export default StorageService.getInstance(); 