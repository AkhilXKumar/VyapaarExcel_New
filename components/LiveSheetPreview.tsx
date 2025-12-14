import React, { useEffect, useState, useMemo } from 'react';
import { fetchSheetData } from '../services/sheets';
import { fetchSampleData } from '../services/sampleData';
import { SheetData } from '../types';
import { Loader2, RefreshCw, AlertCircle, FileSpreadsheet, ExternalLink, BarChart3, Table as TableIcon, Database } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface LiveSheetPreviewProps {
  spreadsheetId?: string;
  range?: string;
  sampleTableName?: string;
  templateName: string;
}

const LiveSheetPreview: React.FC<LiveSheetPreviewProps> = ({ spreadsheetId, range, sampleTableName, templateName }) => {
  const [data, setData] = useState<SheetData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const [sourceType, setSourceType] = useState<'google' | 'supabase'>('google');

  const loadData = async () => {
    if (!spreadsheetId && !sampleTableName) {
      setError("Configuration missing for this template.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let sheetData: SheetData;
      
      // OPTION 1: Prioritize Supabase for Sample Data (Better for Demo consistency)
      if (sampleTableName) {
          try {
              sheetData = await fetchSampleData(sampleTableName);
              setSourceType('supabase');
              if (sheetData.rows.length === 0) throw new Error("Table empty");
          } catch (e) {
              console.warn("Supabase fetch failed, falling back to Sheets if available", e);
              // Fallback to sheets if supabase fails
              if (spreadsheetId && range) {
                  sheetData = await fetchSheetData(spreadsheetId, range);
                  setSourceType('google');
              } else {
                  throw e;
              }
          }
      } 
      // OPTION 2: Use Google Sheets API directly
      else if (spreadsheetId && range) {
          sheetData = await fetchSheetData(spreadsheetId, range);
          setSourceType('google');
      } else {
          throw new Error("No data source configured");
      }
      
      setData(sheetData);
      
      // Auto-switch to chart if data looks very numeric and clean
      if (sheetData.rows.length > 0 && sheetData.headers.length > 1) {
         // simple heuristic check: Check if 2nd column is numeric
         const secondCol = sheetData.rows[0][1];
         if (secondCol && !isNaN(Number(secondCol.replace(/[^0-9.-]+/g,"")))) {
             // setViewMode('chart'); 
         }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load sheet data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto-refresh every 15 seconds as per requirements
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, [spreadsheetId, range, sampleTableName]);

  // Transform sheet data for Recharts
  const chartData = useMemo(() => {
    if (!data || !data.rows || data.rows.length === 0) return [];

    const headers = data.headers;
    const rows = data.rows;
    
    // Find numeric column
    let valueColIndex = -1;
    
    if (rows[0]) {
      rows[0].forEach((cell, idx) => {
        if (idx === 0) return; // Skip label column
        const cleanVal = cell.replace(/[^0-9.-]+/g,"");
        if (cleanVal && !isNaN(parseFloat(cleanVal)) && valueColIndex === -1) {
          valueColIndex = idx;
        }
      });
    }

    if (valueColIndex === -1) return [];

    return rows.map((row) => {
      const val = row[valueColIndex] ? parseFloat(row[valueColIndex].replace(/[^0-9.-]+/g,"")) : 0;
      return {
        name: row[0] || 'Unknown',
        value: val,
        [headers[valueColIndex] || 'Value']: val
      };
    }).slice(0, 10);
  }, [data]);

  if (!spreadsheetId && !sampleTableName) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full max-h-[500px]">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-green-100 p-1.5 rounded-md">
            <FileSpreadsheet className="w-4 h-4 text-green-700" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              {templateName}
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800 animate-pulse">
                ● SAMPLE PREVIEW
              </span>
            </h4>
          </div>
        </div>
        <div className="flex items-center gap-2">
           {chartData.length > 0 && (
             <div className="flex bg-slate-200 rounded-lg p-0.5 mr-2">
                <button 
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <TableIcon className="w-3.5 h-3.5" /> Table
                </button>
                <button 
                  onClick={() => setViewMode('chart')}
                  className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 ${viewMode === 'chart' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <BarChart3 className="w-3.5 h-3.5" /> Chart
                </button>
             </div>
           )}

          <button 
            onClick={loadData} 
            disabled={loading}
            className="p-1.5 hover:bg-white rounded-md transition-colors text-slate-500 border border-transparent hover:border-slate-200"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-white relative flex flex-col">
        {loading && !data && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        )}

        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
            <p className="text-sm font-medium text-slate-800 mb-1">Connection Failed</p>
            <p className="text-xs max-w-xs mx-auto mb-4">{error}</p>
          </div>
        ) : data ? (
          <>
            {viewMode === 'table' ? (
               <div className="overflow-auto flex-1">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50 sticky top-0 z-10">
                    <tr>
                      {data.headers.map((header, idx) => (
                        <th key={idx} scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap border-b border-slate-200 bg-slate-50">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {data.rows.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-slate-50/80 transition-colors">
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className="px-4 py-2.5 whitespace-nowrap text-sm text-slate-700 font-mono">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
               </div>
            ) : (
              <div className="flex-1 p-4 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{fontSize: 12}} />
                    <YAxis tick={{fontSize: 12}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4F46E5' : '#6366F1'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        ) : (
           <div className="flex items-center justify-center h-full text-slate-400 text-sm">
              Connecting to {sourceType === 'supabase' ? 'Sample Database' : 'Google Sheets'}...
           </div>
        )}
      </div>
      
      {/* Footer / Badge */}
      <div className="bg-slate-50 border-t border-slate-200 px-3 py-2 flex justify-between items-center text-[10px] text-slate-500 shrink-0">
        <span className="flex items-center gap-1">
           {sourceType === 'supabase' ? <Database className="w-3 h-3 text-indigo-500" /> : <FileSpreadsheet className="w-3 h-3 text-green-600" />}
           {sourceType === 'supabase' ? 'Source: Supabase DB' : 'Source: Google Sheets API'}
        </span>
        {spreadsheetId && sourceType === 'google' && (
             <a 
                href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-indigo-600 font-medium"
            >
                View Source <ExternalLink className="w-3 h-3" />
            </a>
        )}
      </div>
    </div>
  );
};

export default LiveSheetPreview;