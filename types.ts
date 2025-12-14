export interface Template {
  id: string;
  title: string;
  category: 'Sales' | 'Finance' | 'Operations' | 'HR';
  price: number;
  description: string;
  features: string[];
  color: string;
  spreadsheetId?: string; // Google Sheet ID
  sheetRange?: string;    // e.g., 'Sheet1!A1:E10'
  sampleTableName?: string; // Supabase Table Name for preview data
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

export interface SheetData {
  headers: string[];
  rows: string[][];
  lastUpdated: Date;
}