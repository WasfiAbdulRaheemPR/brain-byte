import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  ClipboardList,
  Map as MapIcon,
  CopyCheck,
  ShieldAlert,
  History,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard & Analytics', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Complaint Registry', href: '/admin/complaints', icon: ClipboardList },
    { name: 'Interactive Issue Map', href: '/admin/map', icon: MapIcon },
    { name: 'Duplicate Detection', href: '/admin/duplicates', icon: CopyCheck },
    { name: 'Administrative Audit Trail', href: '/admin/audit-logs', icon: History },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col md:flex-row">
      {/* Desktop Admin Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-[#0E1E34] text-white z-30 shadow-xl border-r border-slate-800">
        {/* Logo & Admin Badge */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-teal flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-lg tracking-tight leading-tight">
                Civic<span className="text-brand-teal">Connect</span>
              </div>
              <div className="text-[10px] text-brand-teal font-semibold tracking-wider uppercase flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-teal"></span>
                Authority Console
              </div>
            </div>
          </div>
        </div>

        {/* Administrator Profile Card */}
        <div className="p-3.5 mx-4 my-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="text-[11px] text-slate-400">Authorized Admin</div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              OFFICIAL
            </span>
          </div>
          <div className="font-semibold text-sm text-white truncate mt-1">{user?.fullName}</div>
          <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-teal text-white shadow'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.name}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white px-2 py-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Home</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#0E1E34] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-brand-teal" />
          <span className="font-bold text-base">CivicConnect Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0E1E34] text-white px-4 py-4 space-y-2 border-b border-slate-800 shadow-xl">
          <div className="px-3 py-2 rounded-lg bg-slate-900/90 mb-3">
            <div className="text-xs text-slate-400">Admin Session</div>
            <div className="font-semibold text-sm">{user?.fullName}</div>
          </div>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-brand-teal text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <Link to="/" className="text-xs text-slate-400 hover:text-white">
              Public Home
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="text-xs text-red-300 hover:text-red-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Admin Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

