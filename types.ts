export interface Template {
  id: string;
  title: string;
  category: 'Sales' | 'Finance' | 'Operations' | 'HR';
  price: number;
  description: string;
  features: string[];
  color: string;
}

export type ViewState = 'home' | 'templates' | 'blueprint' | 'pricing';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

export interface BusinessBlueprint {
  title: string;
  content: string;
}