import React, { useState } from 'react';
import { X, Check, AlertCircle, FileCheck, HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ApplicationCategory } from '../../types';
import { APPLICATION_CATEGORY_CONFIG } from '../../mock/initialData';

interface CreateApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateApplicationModal: React.FC<CreateApplicationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser, createApplication, submitApplication, openApplicationModal } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [category, setCategory] = useState<ApplicationCategory>('eoa');
  const [summary, setSummary] = useState('');
  const [intakeChange, setIntakeChange] = useState('');
  const [acknowledgedChecklist, setAcknowledgedChecklist] = useState<Record<string, boolean>>({});
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCategoryConfig = APPLICATION_CATEGORY_CONFIG[category];

  const handleNextToStep2 = () => {
    setStep(2);
  };

  const handleNextToStep3 = () => {
    if (!summary.trim()) {
      setValidationError('Please provide a brief executive summary of this regulatory filing.');
      return;
    }
    setValidationError(null);
    setStep(3);
  };

  const handleCreateAndSaveDraft = () => {
    const createdApp = createApplication(category, summary, intakeChange);
    onClose();
    openApplicationModal(createdApp.id);
  };

  const handleCreateAndSubmitNow = () => {
    // Check if mandatory checklist items are acknowledged
    const allChecked = currentCategoryConfig.requiredChecklist.every(
      (item) => acknowledgedChecklist[item]
    );

    if (!allChecked) {
      setValidationError('Please acknowledge readiness for all mandatory category documents before formal submission, or choose "Save as Draft" instead.');
      return;
    }

    const createdApp = createApplication(category, summary, intakeChange);
    submitApplication(createdApp.id);
    onClose();
    openApplicationModal(createdApp.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Create AICTE Regulatory Application (Step {step} of 3)
            </h3>
            <p className="text-xs text-neutral-500">
              {currentUser.institution || 'K.J. Somaiya College of Engineering, Mumbai'} (ID: {currentUser.institutionId || '1-10972341'})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {validationError && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl flex items-start gap-2 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Select AICTE Approval Category:
              </label>

              <div className="space-y-2">
                {(Object.keys(APPLICATION_CATEGORY_CONFIG) as ApplicationCategory[]).map((catKey) => {
                  const cfg = APPLICATION_CATEGORY_CONFIG[catKey];
                  const isSelected = category === catKey;
                  return (
                    <div
                      key={catKey}
                      onClick={() => setCategory(catKey)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-blue-600'
                          : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                          {cfg.label}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">{cfg.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Selected Category
                </label>
                <div className="p-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs font-medium text-neutral-800 dark:text-neutral-200">
                  {currentCategoryConfig.label}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Application Executive Summary & Rationale <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="State the objective, academic justification, and primary scope of this submission..."
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Requested Intake Capacity / Seat Adjustment Details (Optional)
                </label>
                <input
                  type="text"
                  value={intakeChange}
                  onChange={(e) => setIntakeChange(e.target.value)}
                  placeholder="e.g. Existing: 720 seats, Proposed: Maintain existing OR +60 seats"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 text-neutral-900 dark:text-neutral-100"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-blue-900 dark:text-blue-200">
                <strong>Mandatory Regulatory Document Checklist:</strong> Please verify that your institution holds the following certified documents ready for automated OCR scrutiny.
              </div>

              <div className="space-y-2">
                {currentCategoryConfig.requiredChecklist.map((item, idx) => (
                  <label
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={!!acknowledgedChecklist[item]}
                      onChange={(e) =>
                        setAcknowledgedChecklist((prev) => ({
                          ...prev,
                          [item]: e.target.checked,
                        }))
                      }
                      className="mt-0.5 w-4 h-4 rounded text-blue-600 border-neutral-300 dark:border-neutral-700 focus:ring-blue-500"
                    />
                    <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="px-3.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-100"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {step === 1 && (
              <button
                onClick={handleNextToStep2}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
              >
                Continue to Application Details &rarr;
              </button>
            )}

            {step === 2 && (
              <button
                onClick={handleNextToStep3}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
              >
                Continue to Document Checklist &rarr;
              </button>
            )}

            {step === 3 && (
              <>
                <button
                  onClick={handleCreateAndSaveDraft}
                  className="px-3.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-100"
                >
                  Save as Draft
                </button>
                <button
                  onClick={handleCreateAndSubmitNow}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  Submit for Scrutiny
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
