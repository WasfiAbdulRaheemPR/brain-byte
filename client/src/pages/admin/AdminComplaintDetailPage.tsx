import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '../../services/api';
import { Complaint, Department, ComplaintStatus, Priority } from '../../types';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert,
  User,
  CopyCheck,
  FileCheck2,
  ImageIcon,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminComplaintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  // Action states
  const [status, setStatus] = useState<ComplaintStatus>('UNDER_REVIEW');
  const [statusNote, setStatusNote] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [departmentId, setDepartmentId] = useState('');
  const [resolutionText, setResolutionText] = useState('');
  const [adminNote, setAdminNote] = useState('');

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch complaint details
  const { data, isLoading, error } = useQuery<{ complaint: Complaint }>({
    queryKey: ['adminComplaintDetail', id],
    queryFn: async () => {
      const res = await api.get(`/admin/complaints/${id}`);
      return res.data?.data;
    },
    enabled: !!id,
  });

  // Fetch departments
  const { data: deptData } = useQuery<{ departments: Department[] }>({
    queryKey: ['departments'],
    queryFn: async () => (await api.get('/admin/departments')).data?.data,
  });

  const complaint = data?.complaint;
  const departments = deptData?.departments || [];

  // Update Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async () => {
      await api.patch(`/admin/complaints/${id}/status`, {
        status,
        description: statusNote,
      });
    },
    onSuccess: () => {
      setNotification({ type: 'success', message: 'Status updated successfully' });
      setStatusNote('');
      queryClient.invalidateQueries({ queryKey: ['adminComplaintDetail', id] });
    },
    onError: (err) => setNotification({ type: 'error', message: getErrorMessage(err) }),
  });

  // Update Priority Mutation
  const updatePriorityMutation = useMutation({
    mutationFn: async () => {
      await api.patch(`/admin/complaints/${id}/priority`, { priority });
    },
    onSuccess: () => {
      setNotification({ type: 'success', message: 'Priority updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['adminComplaintDetail', id] });
    },
    onError: (err) => setNotification({ type: 'error', message: getErrorMessage(err) }),
  });

  // Assign Department Mutation
  const assignDepartmentMutation = useMutation({
    mutationFn: async () => {
      await api.patch(`/admin/complaints/${id}/department`, { departmentId });
    },
    onSuccess: () => {
      setNotification({ type: 'success', message: 'Department assigned successfully' });
      queryClient.invalidateQueries({ queryKey: ['adminComplaintDetail', id] });
    },
    onError: (err) => setNotification({ type: 'error', message: getErrorMessage(err) }),
  });

  // Record Resolution Mutation
  const recordResolutionMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/admin/complaints/${id}/resolution`, {
        resolutionDescription: resolutionText,
      });
    },
    onSuccess: () => {
      setNotification({ type: 'success', message: 'Resolution recorded and verified.' });
      setResolutionText('');
      queryClient.invalidateQueries({ queryKey: ['adminComplaintDetail', id] });
    },
    onError: (err) => setNotification({ type: 'error', message: getErrorMessage(err) }),
  });

  // Add Internal Note Mutation
  const addNoteMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/admin/complaints/${id}/notes`, { note: adminNote });
    },
    onSuccess: () => {
      setNotification({ type: 'success', message: 'Administrative note attached.' });
      setAdminNote('');
      queryClient.invalidateQueries({ queryKey: ['adminComplaintDetail', id] });
    },
    onError: (err) => setNotification({ type: 'error', message: getErrorMessage(err) }),
  });

  if (isLoading) return <LoadingSpinner label="Loading municipal complaint file..." size="lg" />;

  if (error || !complaint) {
    return (
      <div className="space-y-4">
        <Link to="/admin/complaints" className="text-xs text-brand-teal flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Registry
        </Link>
        <Alert
          type="error"
          title="Record Not Found"
          message={error ? getErrorMessage(error) : 'Complaint does not exist.'}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Back button */}
      <Link
        to="/admin/complaints"
        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-muted hover:text-brand-text"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Registry
      </Link>

      {notification && (
        <Alert
          type={notification.type}
          message={notification.message}
          className="animate-in fade-in"
        />
      )}

      {/* Main Container */}
      <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden p-6 sm:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-brand-teal bg-brand-teal-light px-2.5 py-0.5 rounded">
                {complaint.complaintNumber}
              </span>
              <span className="text-xs text-brand-muted">•</span>
              <span className="text-xs text-brand-muted flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Submitted on {new Date(complaint.createdAt).toLocaleString()}
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

        {/* 2-Column Inspector Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Complaint Data */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">
                Citizen Statement & Allegation
              </h4>
              <p className="text-sm text-brand-text leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {complaint.description}
              </p>
            </div>

            {/* Photos */}
            {complaint.images && complaint.images.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-brand-teal" />
                  Uploaded Photographic Evidence ({complaint.images.length})
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
                        <ExternalLink className="w-3.5 h-3.5" /> View Photo
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Reporting Citizen Profile */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
              <div className="font-semibold text-brand-navy flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-brand-teal" /> Reporting Citizen Details
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>Name: <strong className="text-brand-navy">{complaint.user?.fullName}</strong></div>
                <div>Email: <strong className="text-brand-navy">{complaint.user?.email}</strong></div>
                {complaint.user?.phone && (
                  <div>Phone: <strong className="text-brand-navy">{complaint.user.phone}</strong></div>
                )}
              </div>
            </div>

            {/* Status History */}
            {complaint.statusHistory && complaint.statusHistory.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-3">
                  Official Status History
                </h4>
                <div className="space-y-3">
                  {complaint.statusHistory.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200 text-xs"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-teal mt-1"></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-brand-navy">
                            {h.newStatus.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(h.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-brand-muted mt-0.5">{h.description}</p>
                        <div className="text-[10px] text-brand-teal mt-0.5">
                          Recorded by: {h.updatedBy?.fullName} ({h.updatedBy?.role})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resolution Record */}
            {complaint.resolution && (
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-xs text-emerald-950 space-y-2">
                <div className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Resolution Confirmed
                </div>
                <p>{complaint.resolution.resolutionDescription}</p>
                <div className="text-[11px] text-emerald-800 pt-1 border-t border-emerald-200/60 flex justify-between">
                  <span>Resolved by: <strong>{complaint.resolution.resolvedBy?.fullName}</strong></span>
                  <span>{new Date(complaint.resolution.resolvedAt).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Administrative Controls */}
          <div className="lg:col-span-5 space-y-5">
            {/* Action Card: Status Update */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
              <h3 className="font-bold text-sm text-brand-navy">Update Progression Status</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateStatusMutation.mutate();
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="SUBMITTED">Submitted</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Administrative Note (Required) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Rationale for this state transition..."
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  isLoading={updateStatusMutation.isPending}
                  className="w-full"
                >
                  Apply Status Update
                </Button>
              </form>
            </div>

            {/* Action Card: Department & Priority */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
              <h3 className="font-bold text-sm text-brand-navy">Triage & Department</h3>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Priority</label>
                <div className="flex gap-2">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="flex-1 p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updatePriorityMutation.mutate()}
                    isLoading={updatePriorityMutation.isPending}
                  >
                    Update
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Responsible Municipal Department
                </label>
                <div className="flex gap-2">
                  <select
                    value={departmentId || complaint.departmentId || ''}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="flex-1 p-2 border border-slate-300 rounded-lg bg-white truncate"
                  >
                    <option value="">-- Assign Department --</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => assignDepartmentMutation.mutate()}
                    isLoading={assignDepartmentMutation.isPending}
                  >
                    Assign
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Card: Record Resolution */}
            {complaint.status !== 'RESOLVED' && (
              <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200 space-y-4 text-xs">
                <h3 className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Execute Final Resolution
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    recordResolutionMutation.mutate();
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-emerald-900 font-semibold mb-1">
                      Resolution Description *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={resolutionText}
                      onChange={(e) => setResolutionText(e.target.value)}
                      placeholder="Specify corrective repairs executed on site..."
                      className="w-full p-2 border border-emerald-300 rounded-lg bg-white"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    variant="secondary"
                    isLoading={recordResolutionMutation.isPending}
                    className="w-full"
                  >
                    Confirm & Mark Resolved
                  </Button>
                </form>
              </div>
            )}

            {/* Action Card: Add Internal Note */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <h3 className="font-bold text-sm text-brand-navy">Append Administrative Audit Note</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Internal notes..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="flex-1 p-2 border border-slate-300 rounded-lg text-xs"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addNoteMutation.mutate()}
                  isLoading={addNoteMutation.isPending}
                >
                  Post Note
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
