import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '../../services/api';
import { Complaint, Category, Department, ComplaintStatus, Priority } from '../../types';
import {
  ClipboardList,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  User,
  X,
  Plus,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Alert } from '../../components/common/Alert';

export const AdminComplaintsPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Search and Filter states
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<string>('');

  // Modals state
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [actionType, setActionType] = useState<'status' | 'priority' | 'department' | 'resolution' | null>(null);

  // Action form states
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('UNDER_REVIEW');
  const [statusDescription, setStatusDescription] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('MEDIUM');
  const [newDeptId, setNewDeptId] = useState('');
  const [resolutionDesc, setResolutionDesc] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  // Fetch complaints
  const { data: complaintsData, isLoading } = useQuery<{
    complaints: Complaint[];
    total: number;
  }>({
    queryKey: ['adminComplaints', status, priority, categoryId, departmentId, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (priority) params.append('priority', priority);
      if (categoryId) params.append('categoryId', categoryId);
      if (departmentId) params.append('departmentId', departmentId);
      if (search) params.append('search', search);

      const res = await api.get(`/admin/complaints?${params.toString()}`);
      return res.data?.data;
    },
  });

  // Fetch categories & departments for filter dropdowns
  const { data: catData } = useQuery<{ categories: Category[] }>({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/complaints/categories')).data,
  });

  const { data: deptData } = useQuery<{ departments: Department[] }>({
    queryKey: ['departments'],
    queryFn: async () => (await api.get('/admin/departments')).data?.data,
  });

  const complaints = complaintsData?.complaints || [];
  const categories = catData?.categories || [];
  const departments = deptData?.departments || [];

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: async () => {
      if (!selectedComplaint) return;
      await api.patch(`/admin/complaints/${selectedComplaint.id}/status`, {
        status: newStatus,
        description: statusDescription,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminComplaints'] });
      closeModal();
    },
    onError: (err) => setActionError(getErrorMessage(err)),
  });

  const updatePriorityMutation = useMutation({
    mutationFn: async () => {
      if (!selectedComplaint) return;
      await api.patch(`/admin/complaints/${selectedComplaint.id}/priority`, {
        priority: newPriority,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminComplaints'] });
      closeModal();
    },
    onError: (err) => setActionError(getErrorMessage(err)),
  });

  const assignDepartmentMutation = useMutation({
    mutationFn: async () => {
      if (!selectedComplaint) return;
      await api.patch(`/admin/complaints/${selectedComplaint.id}/department`, {
        departmentId: newDeptId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminComplaints'] });
      closeModal();
    },
    onError: (err) => setActionError(getErrorMessage(err)),
  });

  const recordResolutionMutation = useMutation({
    mutationFn: async () => {
      if (!selectedComplaint) return;
      await api.post(`/admin/complaints/${selectedComplaint.id}/resolution`, {
        resolutionDescription: resolutionDesc,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminComplaints'] });
      closeModal();
    },
    onError: (err) => setActionError(getErrorMessage(err)),
  });

  const openModal = (
    complaint: Complaint,
    type: 'status' | 'priority' | 'department' | 'resolution'
  ) => {
    setSelectedComplaint(complaint);
    setActionType(type);
    setActionError(null);
    setNewStatus(complaint.status);
    setNewPriority(complaint.priority);
    setNewDeptId(complaint.departmentId || '');
    setStatusDescription('');
    setResolutionDesc('');
  };

  const closeModal = () => {
    setSelectedComplaint(null);
    setActionType(null);
    setActionError(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
          Municipal Complaint Registry
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-1">
          Review submissions, assign responsible municipal engineering divisions, and issue audited status progressions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-3 items-center justify-between">
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, title, keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal text-brand-text"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full lg:w-auto items-center">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-teal"
          >
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted (Unreviewed)</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-teal"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-teal max-w-[140px] truncate"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-teal max-w-[140px] truncate"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        {isLoading ? (
          <LoadingSpinner label="Querying municipal registry..." />
        ) : complaints.length === 0 ? (
          <div className="p-12 text-center text-xs text-brand-muted">
            No complaints match the specified filtering criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">ID & Date</th>
                  <th className="px-5 py-3">Issue Title</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Reporting Citizen</th>
                  <th className="px-5 py-3">Priority</th>
                  <th className="px-5 py-3">Assigned Dept</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="font-mono font-bold text-brand-navy">{c.complaintNumber}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="px-5 py-3.5 max-w-xs">
                      <Link
                        to={`/admin/complaints/${c.id}`}
                        className="font-semibold text-brand-navy hover:text-brand-teal line-clamp-1"
                      >
                        {c.title}
                      </Link>
                      {c.address && (
                        <div className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                          <MapPin className="w-2.5 h-2.5 text-brand-teal flex-shrink-0" />
                          {c.address}
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap text-brand-muted">
                      {c.category?.name}
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="font-medium text-brand-navy">{c.user?.fullName}</div>
                      <div className="text-[10px] text-slate-400">{c.user?.email}</div>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <button
                        onClick={() => openModal(c, 'priority')}
                        title="Click to change priority"
                      >
                        <PriorityBadge priority={c.priority} size="sm" />
                      </button>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <button
                        onClick={() => openModal(c, 'department')}
                        className="text-[11px] font-medium text-brand-teal hover:underline max-w-[120px] truncate block"
                        title="Click to assign department"
                      >
                        {c.department?.name ? c.department.name.split(' ')[0] : '+ Assign Dept'}
                      </button>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <button
                        onClick={() => openModal(c, 'status')}
                        title="Click to update status"
                      >
                        <StatusBadge status={c.status} size="sm" />
                      </button>
                    </td>

                    <td className="px-5 py-3.5 text-right whitespace-nowrap space-x-1.5">
                      {c.status !== 'RESOLVED' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openModal(c, 'resolution')}
                          className="text-[10px] px-2 py-1"
                        >
                          Resolve
                        </Button>
                      )}
                      <Link to={`/admin/complaints/${c.id}`}>
                        <Button variant="outline" size="sm" className="text-[10px] px-2 py-1">
                          Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Actions */}
      {actionType && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-brand-navy">
                  {actionType === 'status' && 'Update Complaint Status'}
                  {actionType === 'priority' && 'Adjust Priority Level'}
                  {actionType === 'department' && 'Assign Responsible Department'}
                  {actionType === 'resolution' && 'Record Official Resolution'}
                </h3>
                <span className="font-mono text-xs text-brand-teal">
                  {selectedComplaint.complaintNumber}
                </span>
              </div>
              <button onClick={closeModal} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionError && <Alert type="error" message={actionError} />}

            {/* Status Modal Form */}
            {actionType === 'status' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateStatusMutation.mutate();
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-semibold text-brand-navy mb-1">New Status *</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="SUBMITTED">Submitted</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-brand-navy mb-1">
                    Administrative Note (Required) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={statusDescription}
                    onChange={(e) => setStatusDescription(e.target.value)}
                    placeholder="Provide official rationale (e.g. Field team dispatched with asphalt equipment)..."
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" size="sm" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" isLoading={updateStatusMutation.isPending}>
                    Save Status
                  </Button>
                </div>
              </form>
            )}

            {/* Priority Modal Form */}
            {actionType === 'priority' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updatePriorityMutation.mutate();
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-semibold text-brand-navy mb-1">Select Priority *</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" size="sm" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" isLoading={updatePriorityMutation.isPending}>
                    Save Priority
                  </Button>
                </div>
              </form>
            )}

            {/* Department Modal Form */}
            {actionType === 'department' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  assignDepartmentMutation.mutate();
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-semibold text-brand-navy mb-1">Assign Department *</label>
                  <select
                    value={newDeptId}
                    onChange={(e) => setNewDeptId(e.target.value)}
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="">-- Select Department --</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" size="sm" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" isLoading={assignDepartmentMutation.isPending}>
                    Assign Department
                  </Button>
                </div>
              </form>
            )}

            {/* Record Resolution Modal Form */}
            {actionType === 'resolution' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  recordResolutionMutation.mutate();
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-semibold text-brand-navy mb-1">
                    Resolution Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={resolutionDesc}
                    onChange={(e) => setResolutionDesc(e.target.value)}
                    placeholder="Detail engineering actions taken (e.g. 4 meters of pipeline replaced and pressure tested)..."
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200">
                  Notice: Filing this resolution officially completes the complaint lifecycle and notifies the citizen.
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" size="sm" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="secondary" size="sm" isLoading={recordResolutionMutation.isPending}>
                    Confirm Resolution
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
