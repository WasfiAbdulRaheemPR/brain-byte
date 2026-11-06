import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { AuditLog } from '../../types';
import { History, ShieldCheck, Clock, User, FileText } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminAuditLogsPage: React.FC = () => {
  const { data, isLoading } = useQuery<{ auditLogs: AuditLog[] }>({
    queryKey: ['adminAuditLogs'],
    queryFn: async () => (await api.get('/admin/audit-logs')).data?.data,
  });

  const auditLogs = data?.auditLogs || [];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-semibold uppercase tracking-wider mb-2">
          <History className="w-3.5 h-3.5" />
          Tamper-Evident Accountability
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
          Administrative Audit Trail
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-1 leading-relaxed">
          Comprehensive historical ledger of all official modifications, priority adjustments, department assignments, and resolution filings.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        {isLoading ? (
          <LoadingSpinner label="Fetching municipal ledger..." />
        ) : auditLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-brand-muted">
            No administrative audit actions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Timestamp</th>
                  <th className="px-6 py-3.5">Administrator</th>
                  <th className="px-6 py-3.5">Action Executed</th>
                  <th className="px-6 py-3.5">Target Entity</th>
                  <th className="px-6 py-3.5">Metadata & Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-brand-navy">{log.admin?.fullName}</div>
                      <div className="text-[10px] text-slate-400">{log.admin?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-[11px] bg-slate-100 text-brand-navy px-2 py-0.5 rounded border border-slate-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-slate-600 font-medium">
                        {log.entityType} ({log.entityId.slice(0, 8)}...)
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-sm truncate text-slate-500 font-mono text-[11px]">
                      {log.metadata || 'N/A'}
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

