export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface NoteDraft {
  title: string;
  content: string;
}

export interface AppSettings {
  enableAI: boolean;
}
