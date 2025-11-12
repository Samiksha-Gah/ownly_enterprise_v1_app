import { motion } from 'framer-motion';
import { Check, Zap, ArrowRight } from 'lucide-react';

export interface SelectionSummaryProps {
  selectedSources: string[];
  selectedFields: { [key: string]: string[] };
  estimatedUsers: number;
  estimatedMonthlyCost: number;
  onContinue?: () => void;
  onPreview?: () => void;
  onGenerate?: () => void;
  isLoading?: boolean;
}

export default function SelectionSummary({
  selectedSources,
  selectedFields,
  estimatedUsers,
  estimatedMonthlyCost,
  onContinue,
  onPreview,
  onGenerate,
  isLoading = false,
}: SelectionSummaryProps) {
  const selectedFieldsCount = Object.values(selectedFields).reduce(
    (sum, fields) => sum + fields.length,
    0
  );

  const isContinueDisabled = selectedFieldsCount === 0 || isLoading;

  return (
    <div className="sticky top-6 h-fit">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-medium text-slate-900">Selection Summary</h3>
        </div>
        
        <div className="p-5 space-y-4">
          <div>
            <div className="flex justify-between text-sm text-slate-600 mb-1">
              <span>Selected Sources</span>
              <span className="font-medium">{selectedSources.length}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600 mb-1">
              <span>Selected Fields</span>
              <span className="font-medium">{selectedFieldsCount}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Estimated Users</span>
              <span className="font-medium">{estimatedUsers.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Estimated Monthly Cost</span>
              <motion.span 
                key={`cost-${estimatedMonthlyCost}`}
                initial={{ scale: 1.1, color: '#3b82f6' }}
                animate={{ scale: 1, color: '#1e293b' }}
                className="text-xl font-semibold text-slate-900"
              >
                ${estimatedMonthlyCost.toFixed(2)}
              </motion.span>
            </div>
            <p className="text-xs text-slate-500">
              Based on {estimatedUsers.toLocaleString()} users × ${(estimatedMonthlyCost / estimatedUsers).toFixed(4)} per user
            </p>
          </div>

          <button
            onClick={onContinue}
            disabled={isContinueDisabled}
            className={`w-full mt-4 py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
              isContinueDisabled
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Continue to Preview</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {selectedFieldsCount === 0 && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-700 flex items-start space-x-2">
              <Zap size={16} className="flex-shrink-0 mt-0.5" />
              <p>Select at least one field to continue</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <h4 className="text-sm font-medium text-slate-900 mb-2">What happens next?</h4>
        <ul className="space-y-2">
          <li className="flex items-start space-x-2">
            <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-slate-600">Preview your dataset with sample data</span>
          </li>
          <li className="flex items-start space-x-2">
            <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-slate-600">Get your API endpoint and documentation</span>
          </li>
          <li className="flex items-start space-x-2">
            <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-slate-600">Start querying your data in minutes</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
