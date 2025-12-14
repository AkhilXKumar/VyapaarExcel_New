import { supabase } from './supabase';
import { TEMPLATES } from '../constants';
import { Template } from '../types';

export const fetchTemplates = async (): Promise<Template[]> => {
  try {
    // Attempt to fetch from Supabase
    const { data, error } = await supabase
      .from('templates_meta')
      .select('*')
      .order('id');

    // If table doesn't exist, is empty, or connection fails, fall back to static constants
    if (error || !data || data.length === 0) {
      if (error?.code !== 'PGRST116') { // Ignore 'table not found' type errors in console
          console.log("Using static templates (Supabase sync optional)");
      }
      return TEMPLATES;
    }

    // Map Supabase snake_case columns to our TypeScript Template interface
    // Expected DB columns: id, title, category, price, description, features (json/array), color, spreadsheet_id, sheet_range, sample_table_name
    return data.map((item: any) => ({
      id: item.id.toString(),
      title: item.title,
      category: item.category,
      price: item.price,
      description: item.description,
      features: item.features || [],
      color: item.color || 'bg-slate-100 text-slate-700',
      spreadsheetId: item.spreadsheet_id, // Map snake_case from DB
      sheetRange: item.sheet_range,        // Map snake_case from DB
      sampleTableName: item.sample_table_name // Map snake_case from DB
    }));
  } catch (err) {
    console.error("Template service error:", err);
    return TEMPLATES;
  }
};

export const subscribeToTemplateUpdates = (onUpdate: () => void) => {
  return supabase
    .channel('templates_meta_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'templates_meta',
      },
      () => {
        console.log("Template metadata updated in Supabase, refreshing UI...");
        onUpdate();
      }
    )
    .subscribe();
};