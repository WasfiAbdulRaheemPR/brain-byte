import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api, getErrorMessage } from '../../services/api';
import { Complaint } from '../../types';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Calendar,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  ImageIcon,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const TrackComplaintPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const [complaintIdInput, setComplaintIdInput] = useState(initialId);
  const [activeComplaintNumber, setActiveComplaintNumber] = useState(initialId);

  const {
    data: complaint,
    isLoading,
    error,
    refetch,
  } = useQuery<Complaint>({
    queryKey: ['trackComplaint', activeComplaintNumber],
    queryFn: async () => {
      if (!activeComplaintNumber.trim()) throw new Error('Please enter a Complaint ID');
      const { data } = await api.get<{ complaint: Complaint }>(`/complaints/track/${activeComplaintNumber.trim()}`);
      return data.complaint;
    },
    enabled: !!activeComplaintNumber.trim(),
    retry: false,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (complaintIdInput.trim()) {
      setSearchParams({ id: complaintIdInput.trim() });
      setActiveComplaintNumber(complaintIdInput.trim());
    }
  };

  const getTimelineStepStatus = (step: 'SUBMITTED' | 'UNDER_REVIEW' | 'IN_PROGRESS' | 'RESOLVED', currentStatus?: string) => {
    const order = ['SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED'];
    const currentIndex = order.indexOf(currentStatus || 'SUBMITTED');
    const stepIndex = order.indexOf(step);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Search Bar */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-semibold uppercase tracking-wider">
          <Search className="w-3.5 h-3.5" />
          Real-Time Public Tracking
        </div>
        <h1 className="text-3xl font-extrabold text-brand-navy tracking-tight">
          Track Your Civic Complaint
        </h1>
        <p className="text-sm text-brand-muted">
          Enter your unique tracking reference (e.g., CC-2026-000001) to view official status and remediation evidence.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 pt-3 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. CC-2026-000001"
              value={complaintIdInput}
              onChange={(e) => setComplaintIdInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent uppercase font-mono"
            />
          </div>
          <Button type="submit" variant="secondary" size="md">
            Track
          </Button>
        </form>

        {/* Demo sample link */}
        <div className="text-xs text-brand-muted">
          Try sample reference:{' '}
          <button
            type="button"
            onClick={() => {
              setComplaintIdInput('CC-2026-000001');
              setActiveComplaintNumber('CC-2026-000001');
              setSearchParams({ id: 'CC-2026-000001' });
            }}
            className="font-mono text-brand-teal underline hover:text-brand-teal-dark font-medium"
          >
            CC-2026-000001
          </button>
        </div>
      </div>

      {isLoading && <LoadingSpinner label="Querying municipal registry..." size="lg" />}

      {error && (
        <Alert
          type="error"
          title="Complaint Record Not Found"
          message={getErrorMessage(error)}
          className="max-w-2xl mx-auto"
        />
      )}

      {complaint && (
        <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden space-y-8 p-6 sm:p-8">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-slate-200 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-brand-teal bg-brand-teal-light px-2.5 py-0.5 rounded">
                  {complaint.complaintNumber}
                </span>
                <span className="text-xs text-brand-muted">•</span>
                <span className="text-xs text-brand-muted flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Reported on {new Date(complaint.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-brand-navy mt-1.5">
                {complaint.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <PriorityBadge priority={complaint.priority} />
              <StatusBadge status={complaint.status} />
            </div>
          </div>

          {/* Visual Lifecycle Stepper */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-teal" />
              Verified Progress Tracker
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
              {[
                { key: 'SUBMITTED', label: '1. Submitted', desc: 'Registered in system' },
                { key: 'UNDER_REVIEW', label: '2. Under Review', desc: 'Assessed by engineer' },
                { key: 'IN_PROGRESS', label: '3. In Progress', desc: 'Field repair active' },
                { key: 'RESOLVED', label: '4. Resolved', desc: 'Verified resolution' },
              ].map((step, idx) => {
                const statusState = getTimelineStepStatus(step.key as any, complaint.status);
                return (
                  <div
                    key={step.key}
                    className={`p-3.5 rounded-lg border text-center transition-all ${
                      statusState === 'completed'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : statusState === 'current'
                        ? 'bg-brand-navy text-white border-brand-navy shadow-sm'
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-1">
                      {statusState === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : statusState === 'current' ? (
                        <Clock className="w-5 h-5 text-brand-teal animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <div className="font-semibold text-xs">{step.label}</div>
                    <div className="text-[10px] mt-0.5 opacity-80">{step.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">
                  Issue Description
                </h4>
                <p className="text-sm text-brand-text leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {complaint.description}
                </p>
              </div>

              {/* Uploaded Photographs */}
              {complaint.images && complaint.images.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-brand-teal" />
                    Uploaded Evidence Photographs ({complaint.images.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {complaint.images.map((img) => (
                      <a
                        key={img.id}
                        href={`/uploads/${img.storageKey}`}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative block aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-sm"
                      >
                        <img
                          src={`/uploads/${img.storageKey}`}
                          alt={img.fileName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1">
                          <ExternalLink className="w-3.5 h-3.5" /> View Full
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Change Audit Timeline */}
              {complaint.statusHistory && complaint.statusHistory.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-3">
                    Status Update History
                  </h4>
                  <div className="space-y-3">
                    {complaint.statusHistory.map((history) => (
                      <div
                        key={history.id}
                        className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200"
                      >
                        <div className="w-2 h-2 rounded-full bg-brand-teal mt-2"></div>
                        <div className="flex-1">
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs font-bold text-brand-navy">
                              {history.newStatus.replace('_', ' ')}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {new Date(history.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-brand-muted mt-0.5">{history.description}</p>
                          <div className="text-[10px] text-brand-teal mt-1">
                            Updated by: {history.updatedBy?.fullName} ({history.updatedBy?.role})
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resolution Evidence Box (Mandatory requirement) */}
              {complaint.resolution && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Verified Official Resolution Record
                  </div>
                  <p className="text-xs text-emerald-950 leading-relaxed">
                    {complaint.resolution.resolutionDescription}
                  </p>
                  <div className="text-[11px] text-emerald-800 flex items-center justify-between border-t border-emerald-200/60 pt-2">
                    <span>Resolved by Officer: <strong>{complaint.resolution.resolvedBy?.fullName}</strong></span>
                    <span>{new Date(complaint.resolution.resolvedAt).toLocaleDateString()}</span>
                  </div>

                  {complaint.resolution.images && complaint.resolution.images.length > 0 && (
                    <div className="pt-2">
                      <div className="text-[11px] font-semibold text-emerald-900 mb-1.5">
                        Post-Resolution Proof Images:
                      </div>
                      <div className="flex gap-2">
                        {complaint.resolution.images.map((img) => (
                          <a
                            key={img.id}
                            href={`/uploads/${img.storageKey}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-20 h-16 rounded overflow-hidden border border-emerald-300"
                          >
                            <img
                              src={`/uploads/${img.storageKey}`}
                              alt="Resolution proof"
                              className="w-full h-full object-cover"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Meta Column */}
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Category</span>
                  <span className="font-semibold text-brand-navy">{complaint.category?.name}</span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-0.5">Assigned Department</span>
                  <span className="font-semibold text-brand-navy">
                    {complaint.department?.name || 'Awaiting Department Assignment'}
                  </span>
                </div>

                {complaint.address && (
                  <div>
                    <span className="text-slate-400 block mb-0.5">Location Area</span>
                    <span className="font-medium text-brand-text flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" />
                      {complaint.address}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 text-blue-900 text-xs leading-relaxed space-y-1">
                <div className="font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                  Public Record Notice
                </div>
                <p>
                  To protect resident safety, citizen contact details are masked on public tracking pages.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
