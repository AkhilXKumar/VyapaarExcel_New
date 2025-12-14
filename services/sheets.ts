import { SheetData } from '../types';

const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;

export const fetchSheetData = async (spreadsheetId: string, range: string): Promise<SheetData> => {
  if (!API_KEY) {
    throw new Error("Missing GOOGLE_SHEETS_API_KEY configuration");
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.values || data.values.length === 0) {
      return {
        headers: [],
        rows: [],
        lastUpdated: new Date()
      };
    }

    // Assume first row is header
    const headers = data.values[0];
    const rows = data.values.slice(1);

    return {
      headers,
      rows,
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error("Google Sheets API Error:", error);
    throw error;
  }
};