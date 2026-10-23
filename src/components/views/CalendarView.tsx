import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Building2,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CalendarEvent } from '../../types';

export const CalendarView: React.FC = () => {
  const { calendarEvents, openApplicationModal, openDocumentModal } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState('March / April 2026');

  const filteredEvents = calendarEvents.filter((ev) => {
    if (filterType === 'all') return true;
    return ev.type === filterType;
  });

  const getUrgencyBadge = (urgency: CalendarEvent['urgency']) => {
    switch (urgency) {
      case 'high':
        return <span className="text-rose-700 dark:text-rose-400 font-semibold text-[11px] bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">High Urgency</span>;
      case 'medium':
        return <span className="text-amber-700 dark:text-amber-400 font-semibold text-[11px] bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">Medium Priority</span>;
      default:
        return <span className="text-neutral-600 dark:text-neutral-400 font-medium text-[11px] bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">Standard Milestone</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Statutory Approval Calendar & Regulatory Deadlines
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Synchronized schedule for document validity expirations, scrutiny committee sessions, and gazetted milestones
          </p>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-semibold">
            <span className="px-3 py-1 text-neutral-800 dark:text-neutral-200">{selectedMonth}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
            filterType === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
          }`}
        >
          All Events ({calendarEvents.length})
        </button>
        <button
          onClick={() => setFilterType('expiry')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
            filterType === 'expiry'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
          }`}
        >
          Document Expirations
        </button>
        <button
          onClick={() => setFilterType('review_deadline')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
            filterType === 'review_deadline'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
          }`}
        >
          Committee Hearings
        </button>
        <button
          onClick={() => setFilterType('inspection')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
            filterType === 'inspection'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
          }`}
        >
          Infrastructure Inspections
        </button>
        <button
          onClick={() => setFilterType('submission_milestone')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
            filterType === 'submission_milestone'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
          }`}
        >
          Approval Order Releases
        </button>
      </div>

      {/* Main 2-Column Split: Events List + Simulated Month Grid Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Timeline Cards */}
        <div className="lg:col-span-2 space-y-3">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs space-y-2 hover:border-blue-400 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shrink-0 font-mono text-center">
                    <div className="text-[10px] font-bold uppercase">
                      {new Date(ev.date).toLocaleString('default', { month: 'short' })}
                    </div>
                    <div className="text-base font-bold">
                      {new Date(ev.date).getDate()}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        {ev.title}
                      </h3>
                      {getUrgencyBadge(ev.urgency)}
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      {ev.institution} · <span className="font-mono text-neutral-600 dark:text-neutral-400">{ev.statusText}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed pl-12">
                {ev.description}
              </p>

              <div className="pl-12 pt-2 flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-100 dark:border-neutral-800">
                <span className="font-mono">Deadline Date: {ev.date}</span>
                {ev.type === 'expiry' && (
                  <button
                    onClick={() => openDocumentModal('doc-001')}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    View Expiring Document &rarr;
                  </button>
                )}
                {ev.type === 'review_deadline' && (
                  <button
                    onClick={() => openApplicationModal('app-001')}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Open Scrutiny Dossier &rarr;
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Col: Statutory Milestones Mini Schedule */}
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 mb-3 uppercase tracking-wider">
              APH 2026-27 Approval Milestones
            </h3>

            <div className="space-y-3 text-xs">
              <div className="pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <div className="text-[11px] font-mono text-neutral-400">15-Feb-2026 to 28-Feb-2026</div>
                <div className="font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">Online Application Submission Window</div>
                <div className="text-emerald-600 text-[11px]">Concluded</div>
              </div>

              <div className="pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <div className="text-[11px] font-mono text-neutral-400">01-Mar-2026 to 31-Mar-2026</div>
                <div className="font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">Regional Scrutiny & Deficiency Reporting</div>
                <div className="text-blue-600 text-[11px] font-medium">Currently Active</div>
              </div>

              <div className="pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <div className="text-[11px] font-mono text-neutral-400">01-Apr-2026 to 15-Apr-2026</div>
                <div className="font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">Standing Hearing Committee (SHC) Appeals</div>
                <div className="text-neutral-500 text-[11px]">Upcoming</div>
              </div>

              <div>
                <div className="text-[11px] font-mono text-neutral-400">30-Apr-2026</div>
                <div className="font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">Final EoA 2026-27 Notification Release</div>
                <div className="text-neutral-500 text-[11px]">Gazetted Target</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
