import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { AdminAnalytics } from '../../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import {
  ClipboardList,
  Map as MapIcon,
  CopyCheck,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Layers,
  Building2,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminDashboard: React.FC = () => {
  const { data, isLoading } = useQuery<{ analytics: AdminAnalytics }>({
    queryKey: ['adminAnalytics'],
    queryFn: async () => {
      const res = await api.get('/admin/analytics');
      return res.data;
    },
  });

  const analytics = data?.analytics;
  const metrics = analytics?.metrics || {
    totalComplaints: 0,
    submitted: 0,
    underReview: 0,
    inProgress: 0,
    resolved: 0,
  };

  const STATUS_COLORS: Record<string, string> = {
    Submitted: '#3b82f6',
    'Under Review': '#8b5cf6',
    'In Progress': '#f59e0b',
    Resolved: '#10b981',
  };

  const PRIORITY_COLORS: Record<string, string> = {
    Low: '#94a3b8',
    Medium: '#3b82f6',
    High: '#f97316',
    Urgent: '#ef4444',
  };

  if (isLoading) return <LoadingSpinner label="Compiling municipal intelligence..." size="lg" />;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-[#0E1E34] text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-teal/20 text-brand-teal text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Executive Oversight Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Municipal Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Real-time analytics, automated duplicate detection, and accountable resolution tracking for local civic infrastructure.
          </p>
        </div>

        <div className="flex gap-2">
          <Link to="/admin/complaints">
            <Button variant="secondary" leftIcon={<ClipboardList className="w-4 h-4" />}>
              Registry
            </Button>
          </Link>
          <Link to="/admin/map">
            <Button variant="outline" className="text-white border-slate-700 bg-slate-800 hover:bg-slate-700" leftIcon={<MapIcon className="w-4 h-4" />}>
              GIS Map
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
            Total Registry
          </div>
          <div className="text-3xl font-black text-brand-navy mt-1">
            {metrics.totalComplaints}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Platform-wide issues</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm">
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            Pending Review
          </div>
          <div className="text-3xl font-black text-blue-900 mt-1">{metrics.submitted}</div>
          <div className="text-[11px] text-blue-500 mt-1">Requires official triage</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-purple-100 shadow-sm">
          <div className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
            Under Review
          </div>
          <div className="text-3xl font-black text-purple-900 mt-1">{metrics.underReview}</div>
          <div className="text-[11px] text-purple-500 mt-1">Assessed by engineer</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-amber-100 shadow-sm">
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
            In Progress
          </div>
          <div className="text-3xl font-black text-amber-900 mt-1">{metrics.inProgress}</div>
          <div className="text-[11px] text-amber-500 mt-1">Field repair active</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm col-span-2 lg:col-span-1">
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Resolved
          </div>
          <div className="text-3xl font-black text-emerald-900 mt-1">{metrics.resolved}</div>
          <div className="text-[11px] text-emerald-500 mt-1">Verified resolutions</div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-brand-navy">Issues by Category</h3>
              <p className="text-xs text-brand-muted">Distribution across municipal disciplines</p>
            </div>
            <Layers className="w-5 h-5 text-brand-teal" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics?.categoryDistribution || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickFormatter={(val) => val.split(' ')[0]}
                />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#142B4A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution (Pie Chart) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-brand-navy">Status Breakdown</h3>
              <p className="text-xs text-brand-muted">Current lifecycle progression</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.statusDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {(analytics?.statusDistribution || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.status] || '#94a3b8'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  formatter={(value) => <span className="text-xs text-brand-text">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend (Line Chart) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-brand-navy">Resolution Trajectory</h3>
              <p className="text-xs text-brand-muted">Complaints logged vs verified closures</p>
            </div>
            <TrendingUp className="w-5 h-5 text-brand-teal" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analytics?.monthlyTrends || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  formatter={(value) => <span className="text-xs text-brand-text">{value}</span>}
                />
                <Line
                  type="monotone"
                  dataKey="submitted"
                  name="Submitted"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  name="Resolved"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Workload */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-brand-navy">Department Performance</h3>
              <p className="text-xs text-brand-muted">Assigned volume vs verified closures</p>
            </div>
            <Building2 className="w-5 h-5 text-brand-navy" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics?.departmentPerformance || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="department" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  formatter={(value) => <span className="text-xs text-brand-text">{value}</span>}
                />
                <Bar dataKey="assigned" name="Assigned" fill="#1E3A5F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#0F9D91" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

