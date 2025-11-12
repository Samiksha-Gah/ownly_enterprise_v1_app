import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DomainSuggestion } from '../types';
import SourceCard from './SourceCard';

interface DomainGroupProps {
  domainSuggestion: DomainSuggestion;
  selectedFields: { [sourceId: string]: string[] };
  onToggleField: (sourceId: string, fieldName: string) => void;
}

export default function DomainGroup({ 
  domainSuggestion, 
  selectedFields, 
  onToggleField 
}: DomainGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const domainName = domainSuggestion.domain.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  // Calculate selected field counts for this domain
  const domainSelectedCount = domainSuggestion.sources.reduce((count, source) => {
    return count + (selectedFields[source.id]?.length || 0);
  }, 0);

  const totalFields = domainSuggestion.sources.reduce((count, source) => {
    return count + source.fields.length;
  }, 0);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left flex justify-between items-center"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-semibold text-slate-900">{domainName}</h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {domainSuggestion.sources.length} {domainSuggestion.sources.length === 1 ? 'source' : 'sources'}
          </span>
          {domainSelectedCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {domainSelectedCount} field{domainSelectedCount === 1 ? '' : 's'} selected
            </span>
          )}
        </div>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-5 space-y-4">
              {domainSuggestion.sources.map((source) => (
                <SourceCard
                  key={source.id}
                  source={source}
                  selectedFields={selectedFields[source.id] || []}
                  onToggleField={(fieldName) => onToggleField(source.id, fieldName)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
