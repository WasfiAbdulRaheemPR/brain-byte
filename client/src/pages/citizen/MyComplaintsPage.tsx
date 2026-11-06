import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Complaint, ComplaintStatus, Priority } from '../../types';
import {
  ListFilter,
  Search,
  FilePlus2,
  MapPin,
  Calendar,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const MyComplaintsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  const { data, isLoading } = useQuery<{ complaints: Complaint[] }>({
    queryKey: ['myComplaints'],
    queryFn: async () => {
      const res = await api.get('/complaints/my');
      return res.data;
    },
  });

  const complaints = data?.complaints || [];

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.complaintNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.address && c.address.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
            My Submitted Complaints
          </h1>
          <p className="text-sm text-brand-muted mt-1">
            Review the status and remediation progress for all your reported community issues.
          </p>
        </div>
        <Link to="/citizen/submit">
          <Button variant="secondary" leftIcon={<FilePlus2 className="w-4 h-4" />}>
            Report New Issue
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, title, address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent text-brand-text"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
          <div className="flex items-center gap-1.5 text-xs text-brand-muted">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-teal"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-teal"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      {/* Complaints List */}
      {isLoading ? (
        <LoadingSpinner label="Loading your complaints..." />
      ) : filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-card">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ListFilter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-brand-navy">No complaints found</h3>
          <p className="text-xs text-brand-muted max-w-sm mx-auto">
            {complaints.length === 0
              ? 'You have not submitted any complaints yet. Report an issue to help improve your neighborhood.'
              : 'No complaints match your applied search or filter criteria.'}
          </p>
          {complaints.length === 0 && (
            <Link to="/citizen/submit">
              <Button variant="secondary" size="sm" className="mt-2">
                Report First Issue
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-xs text-brand-teal bg-brand-teal-light px-2 py-0.5 rounded">
                    {c.complaintNumber}
                  </span>
                  <PriorityBadge priority={c.priority} size="sm" />
                  <StatusBadge status={c.status} size="sm" />
                  <span className="text-xs text-brand-muted">•</span>
                  <span className="text-xs text-brand-muted flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-base text-brand-navy hover:text-brand-teal transition-colors">
                  <Link to={`/citizen/complaints/${c.id}`}>{c.title}</Link>
                </h3>

                <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                  {c.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                  <span>Category: <strong className="text-slate-600">{c.category?.name}</strong></span>
                  {c.department && (
                    <span>Department: <strong className="text-slate-600">{c.department.name}</strong></span>
                  )}
                  {c.address && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-brand-teal" />
                      {c.address}
                    </span>
                  )}
                </div>
              </div>

              <div className="sm:border-l sm:border-slate-200 sm:pl-6 flex items-center justify-end">
                <Link to={`/citizen/complaints/${c.id}`}>
                  <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    View Status
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

