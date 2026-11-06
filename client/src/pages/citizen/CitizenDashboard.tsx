import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { Complaint } from '../../types';
import {
  FilePlus2,
  ListFilter,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery<{ complaints: Complaint[] }>({
    queryKey: ['myComplaints'],
    queryFn: async () => {
      const res = await api.get('/complaints/my');
      return res.data;
    },
  });

  const complaints = data?.complaints || [];

  // Calculate dynamic metrics from real data
  const metrics = {
    total: complaints.length,
    submitted: complaints.filter((c) => c.status === 'SUBMITTED').length,
    underReview: complaints.filter((c) => c.status === 'UNDER_REVIEW').length,
    inProgress: complaints.filter((c) => c.status === 'IN_PROGRESS').length,
    resolved: complaints.filter((c) => c.status === 'RESOLVED').length,
  };

  const recentComplaints = complaints.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-xs font-semibold text-brand-teal uppercase tracking-wider mb-1">
            Citizen Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-sm text-brand-muted mt-1">
            Track your submitted community issues and monitor official remediation in real time.
          </p>
        </div>

        <div className="flex gap-2">
          <Link to="/citizen/submit">
            <Button variant="secondary" leftIcon={<FilePlus2 className="w-4 h-4" />}>
              Report Issue
            </Button>
          </Link>
          <Link to="/track">
            <Button variant="outline" leftIcon={<Search className="w-4 h-4" />}>
              Track ID
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
            Total Filed
          </div>
          <div className="text-2xl font-black text-brand-navy mt-1">{metrics.total}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-brand-teal" /> All personal reports
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm">
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            Submitted
          </div>
          <div className="text-2xl font-black text-blue-900 mt-1">{metrics.submitted}</div>
          <div className="text-[11px] text-blue-500 mt-1">Awaiting review</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-purple-100 shadow-sm">
          <div className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
            Under Review
          </div>
          <div className="text-2xl font-black text-purple-900 mt-1">{metrics.underReview}</div>
          <div className="text-[11px] text-purple-500 mt-1">Engineer triage</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-amber-100 shadow-sm">
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
            In Progress
          </div>
          <div className="text-2xl font-black text-amber-900 mt-1">{metrics.inProgress}</div>
          <div className="text-[11px] text-amber-500 mt-1">Ground crews active</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm col-span-2 lg:col-span-1">
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Resolved
          </div>
          <div className="text-2xl font-black text-emerald-900 mt-1">{metrics.resolved}</div>
          <div className="text-[11px] text-emerald-500 mt-1">Remediation verified</div>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          to="/citizen/submit"
          className="bg-gradient-to-br from-brand-navy to-brand-navy-light text-white p-6 rounded-2xl shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-brand-teal flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <FilePlus2 className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-lg">Report a Problem</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Snap a photo of broken roads, dead streetlights, water leaks, or garbage piles.
            </p>
          </div>
          <div className="text-xs font-semibold text-brand-teal flex items-center gap-1.5 mt-4">
            Start submission <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/citizen/complaints"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-brand-navy flex items-center justify-center mb-4 group-hover:bg-slate-200 transition-colors">
              <ListFilter className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-brand-navy">My Complaints</h3>
            <p className="text-xs text-brand-muted mt-1 leading-relaxed">
              View your full complaint history, status progression, and engineer responses.
            </p>
          </div>
          <div className="text-xs font-semibold text-brand-teal flex items-center gap-1.5 mt-4">
            View history ({complaints.length}) <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/track"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-brand-navy flex items-center justify-center mb-4 group-hover:bg-slate-200 transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-brand-navy">Track by Reference</h3>
            <p className="text-xs text-brand-muted mt-1 leading-relaxed">
              Inspect verified timeline and public evidence using a Complaint Reference ID.
            </p>
          </div>
          <div className="text-xs font-semibold text-brand-teal flex items-center gap-1.5 mt-4">
            Search reference <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Recent Complaints Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-brand-navy">Recent Submissions</h2>
            <p className="text-xs text-brand-muted mt-0.5">
              Your most recent complaints and their current resolution status.
            </p>
          </div>
          <Link
            to="/citizen/complaints"
            className="text-xs font-semibold text-brand-teal hover:text-brand-teal-dark flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {isLoading ? (
          <LoadingSpinner label="Loading recent complaints..." />
        ) : recentComplaints.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FilePlus2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-brand-navy">No complaints submitted yet</h3>
            <p className="text-xs text-brand-muted max-w-sm mx-auto">
              Notice a pothole, unlit street, or trash pile in your neighborhood? Submit your first report in under a minute!
            </p>
            <Link to="/citizen/submit">
              <Button variant="secondary" size="sm" className="mt-2">
                Report First Issue
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Reference ID</th>
                  <th className="px-6 py-3">Issue Title</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Reported On</th>
                  <th className="px-6 py-3">Priority</th>
                  <th className="px-6 py-3">Current Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {recentComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-xs text-brand-navy whitespace-nowrap">
                      {c.complaintNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-brand-navy line-clamp-1">{c.title}</div>
                      {c.address && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 line-clamp-1">
                          <MapPin className="w-3 h-3 text-brand-teal flex-shrink-0" />
                          {c.address}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-brand-muted whitespace-nowrap">
                      {c.category?.name}
                    </td>
                    <td className="px-6 py-4 text-xs text-brand-muted whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PriorityBadge priority={c.priority} size="sm" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Link
                        to={`/citizen/complaints/${c.id}`}
                        className="text-xs font-semibold text-brand-teal hover:text-brand-teal-dark inline-flex items-center gap-1"
                      >
                        Details <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

