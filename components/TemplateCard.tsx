import React, { useState } from 'react';
import { Template } from '../types';
import { Check, FileSpreadsheet, ChevronDown, ChevronUp } from 'lucide-react';
import LiveSheetPreview from './LiveSheetPreview';

interface TemplateCardProps {
  template: Template;
  onPreview: (id: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onPreview }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all overflow-hidden flex flex-col ${showPreview ? 'md:col-span-2 row-span-2' : ''}`}>
      <div className={`h-2 w-full ${template.color.split(' ')[0].replace('bg-', 'bg-')}`}></div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-lg ${template.color}`}>
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
            {template.category}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-2">{template.title}</h3>
        <p className="text-slate-500 text-sm mb-4">{template.description}</p>
        
        {!showPreview && (
          <div className="space-y-2 mb-6 flex-1">
            {template.features.map((feature, idx) => (
              <div key={idx} className="flex items-center text-sm text-slate-700">
                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        )}

        {showPreview && (
           <div className="mb-4 flex-1 min-h-[300px]">
               <LiveSheetPreview 
                  spreadsheetId={template.spreadsheetId} 
                  range={template.sheetRange} 
                  sampleTableName={template.sampleTableName}
                  templateName={template.title}
                />
           </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
          <div>
            <span className="text-xs text-slate-400 block">Single License</span>
            <span className="text-xl font-bold text-slate-900">₹{template.price}</span>
          </div>
          <button 
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showPreview 
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {showPreview ? (
                <>Close Preview <ChevronUp className="w-4 h-4" /></>
            ) : (
                <>Live Sample Data <ChevronDown className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;