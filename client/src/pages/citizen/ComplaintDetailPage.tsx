import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '../../services/api';
import { Complaint } from '../../types';
import {
  Calendar,
  MapPin,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Star,
  MessageSquare,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  ImageIcon,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const ComplaintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  // Feedback form state
  const [rating, setRating] = useState(5);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const { data, isLoading, error } = useQuery<{ complaint: Complaint }>({
    queryKey: ['complaint', id],
    queryFn: async () => {
      const res = await api.get(`/complaints/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const complaint = data?.complaint;

  // Submit Feedback Mutation
  const feedbackMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/complaints/${id}/feedback`, {
        rating,
        comments: feedbackComments,
      });
      return res.data;
    },
    onSuccess: () => {
      setFeedbackSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['complaint', id] });
    },
  });

  const getTimelineStepStatus = (step: 'SUBMITTED' | 'UNDER_REVIEW' | 'IN_PROGRESS' | 'RESOLVED', currentStatus?: string) => {
    const order = ['SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED'];
    const currentIndex = order.indexOf(currentStatus || 'SUBMITTED');
    const stepIndex = order.indexOf(step);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  if (isLoading) return <LoadingSpinner label="Loading complaint record..." size="lg" />;

  if (error || !complaint) {
    return (
      <div className="space-y-4">
        <Link to="/citizen/complaints" className="text-xs text-brand-teal hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Complaints
        </Link>
        <Alert
          type="error"
          title="Unable to load complaint"
          message={error ? getErrorMessage(error) : 'Complaint not found.'}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Back button */}
      <Link
        to="/citizen/complaints"
        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-muted hover:text-brand-text transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to My Complaints
      </Link>

      {/* Main Card */}
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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mt-1.5">
              {complaint.title}
            </h1>
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
            Verified Lifecycle Progression
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { key: 'SUBMITTED', label: '1. Submitted', desc: 'Logged in municipal registry' },
              { key: 'UNDER_REVIEW', label: '2. Under Review', desc: 'Assessed by department' },
              { key: 'IN_PROGRESS', label: '3. In Progress', desc: 'Repair work deployed' },
              { key: 'RESOLVED', label: '4. Resolved', desc: 'Official fix verified' },
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

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">
                Problem Description
              </h4>
              <p className="text-sm text-brand-text leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {complaint.description}
              </p>
            </div>

            {/* Uploaded Evidence Photographs */}
            {complaint.images && complaint.images.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-brand-teal" />
                  Photographic Evidence ({complaint.images.length})
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
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1">
                        <ExternalLink className="w-3.5 h-3.5" /> Full Photo
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Status History Audit Trail */}
            {complaint.statusHistory && complaint.statusHistory.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-3">
                  Chronological Municipal Status Updates
                </h4>
                <div className="space-y-3">
                  {complaint.statusHistory.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-start gap-3 p-3.5 bg-white rounded-lg border border-slate-200"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-teal mt-1.5 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs font-bold text-brand-navy">
                            {h.newStatus.replace('_', ' ')}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(h.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-brand-muted mt-0.5 leading-relaxed">
                          {h.description}
                        </p>
                        <div className="text-[10px] text-brand-teal mt-1">
                          Updated by: {h.updatedBy?.fullName} ({h.updatedBy?.role})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resolution Record */}
            {complaint.resolution && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Verified Resolution Completed
                </div>
                <p className="text-xs text-emerald-950 leading-relaxed">
                  {complaint.resolution.resolutionDescription}
                </p>
                <div className="text-[11px] text-emerald-800 flex items-center justify-between border-t border-emerald-200/60 pt-2">
                  <span>Authorized Officer: <strong>{complaint.resolution.resolvedBy?.fullName}</strong></span>
                  <span>{new Date(complaint.resolution.resolvedAt).toLocaleDateString()}</span>
                </div>

                {complaint.resolution.images && complaint.resolution.images.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[11px] font-semibold text-emerald-900 mb-1.5">
                      After-Repair Photographic Proof:
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

            {/* Satisfaction Feedback Form */}
            {complaint.status === 'RESOLVED' && (
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                <h4 className="text-sm font-bold text-brand-navy flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  Citizen Satisfaction Feedback
                </h4>

                {feedbackSuccess || (complaint.feedbacks && complaint.feedbacks.length > 0) ? (
                  <div className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
                    Thank you! Your feedback on this resolution has been officially recorded.
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      feedbackMutation.mutate();
                    }}
                    className="space-y-3"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-brand-navy mb-1">
                        How satisfied are you with the resolution? (1 to 5 Stars)
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                              rating >= star
                                ? 'bg-amber-400 text-white border-amber-500'
                                : 'bg-white text-slate-500 border-slate-300'
                            }`}
                          >
                            ★ {star}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-navy mb-1">
                        Comments or Remarks
                      </label>
                      <textarea
                        rows={2}
                        value={feedbackComments}
                        onChange={(e) => setFeedbackComments(e.target.value)}
                        placeholder="Was the work done thoroughly? Any remaining issues?"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      isLoading={feedbackMutation.isPending}
                    >
                      Submit Feedback
                    </Button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Right Meta Column */}
          <div className="space-y-4">
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Category</span>
                <span className="font-semibold text-brand-navy">{complaint.category?.name}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Assigned Department</span>
                <span className="font-semibold text-brand-navy">
                  {complaint.department?.name || 'Awaiting Triage & Assignment'}
                </span>
              </div>

              {complaint.address && (
                <div>
                  <span className="text-slate-400 block mb-0.5">Location Landmark</span>
                  <span className="font-medium text-brand-text flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" />
                    {complaint.address}
                  </span>
                </div>
              )}

              {complaint.latitude && complaint.longitude && (
                <div>
                  <span className="text-slate-400 block mb-0.5">Coordinates</span>
                  <span className="font-mono text-slate-600 text-[11px]">
                    {complaint.latitude}, {complaint.longitude}
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 text-blue-900 text-xs leading-relaxed space-y-1">
              <div className="font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                PS-14 Accountability Standard
              </div>
              <p>
                Status changes are immutable and tied to authenticated administrative credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

