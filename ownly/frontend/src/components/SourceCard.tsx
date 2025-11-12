import { useState } from 'react';
import { ChevronDown, ChevronUp, Check, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Source } from '../types';

interface SourceCardProps {
  source: Source;
  selectedFields: string[];
  onToggleField: (fieldName: string) => void;
}

export default function SourceCard({ source, selectedFields, onToggleField }: SourceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const selectedCount = selectedFields.length;
  const allFieldsCount = source.fields.length;

  return (
    <div className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-slate-900">{source.name}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {source.domain.replace('_', ' ')}
            </span>
            {source.freshness === 'real-time' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                Real-time
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600">{source.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-slate-500 mt-2">
            <span>👥 {source.estimated_users.toLocaleString()} users</span>
            <span>🔄 {source.freshness}</span>
            <span>💲 ${source.price_per_user_day.toFixed(4)}/user/day</span>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-4 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} fields`}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 pt-4 border-t border-slate-100"
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-slate-700">
                Fields ({selectedCount}/{allFieldsCount} selected)
              </h4>
              <button
                onClick={() => {
                  // Toggle all fields
                  if (selectedCount === allFieldsCount) {
                    // Deselect all
                    source.fields.forEach(field => onToggleField(field.name));
                  } else {
                    // Select all
                    source.fields
                      .filter(field => !selectedFields.includes(field.name))
                      .forEach(field => onToggleField(field.name));
                  }
                }}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {selectedCount === allFieldsCount ? 'Deselect all' : 'Select all'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {source.fields.map((field) => {
                const isSelected = selectedFields.includes(field.name);
                return (
                  <div 
                    key={field.name}
                    onClick={() => onToggleField(field.name)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected 
                        ? 'border-blue-200 bg-blue-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-slate-900">{field.name}</span>
                          <span className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                            {field.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{field.description}</p>
                        {field.example && (
                          <p className="text-xs text-slate-400 mt-1">
                            e.g. <span className="font-mono">{String(field.example)}</span>
                          </p>
                        )}
                      </div>
                      <div className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded border ${
                        isSelected 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-slate-300'
                      }`}>
                        {isSelected && <Check size={14} className="text-white" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
