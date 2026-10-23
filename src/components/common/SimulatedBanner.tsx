import React, { useState } from 'react';
import { ShieldAlert, RotateCcw, X, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SimulatedBanner: React.FC = () => {
  const { resetToMockData } = useApp();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside aria-label="Prototype environment notice" className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 px-4 py-2 text-xs text-amber-900 dark:text-amber-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            <strong className="font-semibold">Simulated Verification Prototype:</strong> All data, institutions, OCR extractions, and verification checks are fictional demo simulations. External regulatory issuer APIs are not connected. Document anomalies are flagged for human scrutiny and do not constitute legal determinations.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (confirm('Reset all demo applications, documents, and notifications to initial state?')) {
                resetToMockData();
              }
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-950 dark:text-amber-100 bg-amber-200/70 dark:bg-amber-900/60 hover:bg-amber-300 dark:hover:bg-amber-800 rounded transition-colors"
            title="Reset to initial mock state"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Demo Data
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-100 p-0.5 rounded"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
