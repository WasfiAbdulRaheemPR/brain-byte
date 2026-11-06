import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '../../services/api';
import { DuplicateSuggestion } from '../../types';
import {
  CopyCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles,
  MapPin,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminDuplicatesPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{ duplicates: DuplicateSuggestion[] }>({
    queryKey: ['adminDuplicates'],
    queryFn: async () => (await api.get('/admin/duplicates')).data?.data,
  });

  const reviewMutation = useMutation({
    mutationFn: async ({
      id,
      reviewStatus,
    }: {
      id: string;
      reviewStatus: 'CONFIRMED_DUPLICATE' | 'NOT_A_DUPLICATE';
    }) => {
      await api.patch(`/admin/duplicates/${id}/review`, { reviewStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDuplicates'] });
    },
  });

  const duplicates = data?.duplicates || [];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          AI & Spatial Duplicate Triaging
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
          Duplicate Detection Review
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-1 leading-relaxed">
          AI heuristics detect overlapping reports based on GPS distance (&lt;300m), NLP description similarity, and matching categories. Review and confirm work orders.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Evaluating duplicate matches..." />
      ) : duplicates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-card">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-brand-navy">No pending duplicates</h3>
          <p className="text-xs text-brand-muted max-w-sm mx-auto">
            All submitted community issues are currently distinct or have already been triaged.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {duplicates.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-6"
            >
              {/* Top Similarity Badge Banner */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    {Math.round(item.similarityScore * 100)}% Similarity Match
                  </span>
                  <span className="text-xs text-brand-muted">
                    Reason: <strong>{item.reason || 'Category and text correlation'}</strong>
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<XCircle className="w-4 h-4 text-slate-500" />}
                    onClick={() =>
                      reviewMutation.mutate({ id: item.id, reviewStatus: 'NOT_A_DUPLICATE' })
                    }
                    disabled={reviewMutation.isPending}
                    className="text-xs"
                  >
                    Not a Duplicate
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    onClick={() =>
                      reviewMutation.mutate({
                        id: item.id,
                        reviewStatus: 'CONFIRMED_DUPLICATE',
                      })
                    }
                    disabled={reviewMutation.isPending}
                    className="text-xs"
                  >
                    Confirm Duplicate
                  </Button>
                </div>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Primary Complaint */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">
                      Report A (Incoming)
                    </span>
                    <StatusBadge status={item.complaint?.status || 'SUBMITTED'} size="sm" />
                  </div>

                  <div className="font-mono font-bold text-xs text-brand-teal">
                    {item.complaint?.complaintNumber}
                  </div>

                  <h4 className="font-bold text-sm text-brand-navy">
                    {item.complaint?.title}
                  </h4>

                  <p className="text-xs text-brand-muted leading-relaxed line-clamp-3">
                    {item.complaint?.description}
                  </p>

                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center">
                    <span>{item.complaint?.category?.name}</span>
                    <Link
                      to={`/admin/complaints/${item.complaint?.id}`}
                      className="text-brand-teal hover:underline flex items-center gap-1 font-semibold"
                    >
                      Inspect <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Candidate Match Complaint */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">
                      Report B (Existing in Registry)
                    </span>
                    <StatusBadge status={item.possibleDuplicate?.status || 'SUBMITTED'} size="sm" />
                  </div>

                  <div className="font-mono font-bold text-xs text-brand-teal">
                    {item.possibleDuplicate?.complaintNumber}
                  </div>

                  <h4 className="font-bold text-sm text-brand-navy">
                    {item.possibleDuplicate?.title}
                  </h4>

                  <p className="text-xs text-brand-muted leading-relaxed line-clamp-3">
                    {item.possibleDuplicate?.description}
                  </p>

                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center">
                    <span>{item.possibleDuplicate?.category?.name}</span>
                    <Link
                      to={`/admin/complaints/${item.possibleDuplicate?.id}`}
                      className="text-brand-teal hover:underline flex items-center gap-1 font-semibold"
                    >
                      Inspect <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

