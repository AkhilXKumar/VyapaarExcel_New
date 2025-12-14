import { supabase } from './supabase';
import { SheetData } from '../types';

export const fetchSampleData = async (tableName: string): Promise<SheetData> => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(15);

    if (error) {
      console.warn(`Supabase fetch warning for ${tableName}:`, error.message);
      // Return empty structure so UI doesn't crash, allowing fallback or empty state
      return { headers: [], rows: [], lastUpdated: new Date() };
    }

    if (!data || data.length === 0) {
      return { headers: [], rows: [], lastUpdated: new Date() };
    }

    // 1. Extract Headers (Keys from the first object)
    // We format them to be more readable (e.g., "payment_mode" -> "PAYMENT MODE")
    const rawHeaders = Object.keys(data[0]);
    const headers = rawHeaders.map(h => h.replace(/_/g, ' ').toUpperCase());

    // 2. Map Rows
    const rows = data.map(row => 
      rawHeaders.map(header => {
        const val = row[header];
        if (val === null || val === undefined) return '-';
        if (typeof val === 'boolean') return val ? 'Yes' : 'No';
        if (typeof val === 'object') return JSON.stringify(val);
        return String(val);
      })
    );

    return {
      headers,
      rows,
      lastUpdated: new Date()
    };
  } catch (err) {
    console.error("Sample Data Fetch Error:", err);
    throw err;
  }
};