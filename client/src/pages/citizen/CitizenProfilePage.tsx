import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, ShieldCheck, Calendar, Lock } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const CitizenProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
          Citizen Profile & Settings
        </h1>
        <p className="text-sm text-brand-muted mt-1">
          Your verified civic identity and personal settings
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-navy text-white flex items-center justify-center font-bold text-xl shadow-sm">
            {user?.fullName?.charAt(0) || 'C'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-navy">{user?.fullName}</h2>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Resident Profile
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4 text-sm divide-y divide-slate-100">
          <div className="pt-3 flex justify-between items-center">
            <span className="text-brand-muted flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" /> Email Address
            </span>
            <span className="font-semibold text-brand-navy">{user?.email}</span>
          </div>

          <div className="pt-3 flex justify-between items-center">
            <span className="text-brand-muted flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" /> Contact Phone
            </span>
            <span className="font-semibold text-brand-navy">{user?.phone || 'Not provided'}</span>
          </div>

          <div className="pt-3 flex justify-between items-center">
            <span className="text-brand-muted flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-400" /> Platform Role
            </span>
            <span className="font-bold text-xs uppercase text-brand-teal bg-brand-teal-light px-2 py-0.5 rounded">
              {user?.role}
            </span>
          </div>

          <div className="pt-3 flex justify-between items-center">
            <span className="text-brand-muted flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" /> Member Since
            </span>
            <span className="font-medium text-slate-600">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
