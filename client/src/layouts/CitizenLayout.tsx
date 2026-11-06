import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  FilePlus2,
  ListFilter,
  User,
  LogOut,
  ShieldAlert,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const CitizenLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/citizen/dashboard', icon: LayoutDashboard },
    { name: 'Report New Issue', href: '/citizen/submit', icon: FilePlus2 },
    { name: 'My Complaints', href: '/citizen/complaints', icon: ListFilter },
    { name: 'My Profile', href: '/citizen/profile', icon: User },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-brand-navy text-white z-30 shadow-lg">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-teal flex items-center justify-center text-white shadow-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-lg tracking-tight leading-tight">
              Civic<span className="text-brand-teal">Connect</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
              Citizen Portal
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 my-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="text-xs text-slate-400">Welcome,</div>
          <div className="font-semibold text-sm text-white truncate">{user?.fullName}</div>
          <div className="text-[11px] text-brand-teal mt-0.5 truncate">{user?.email}</div>
        </div>

        {/* Navigation links */}
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
                    ? 'bg-brand-teal text-white shadow-sm'
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
      <div className="md:hidden bg-brand-navy text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-brand-teal" />
          <span className="font-bold text-base">CivicConnect Citizen</span>
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
        <div className="md:hidden bg-brand-navy text-white px-4 py-4 space-y-2 border-b border-slate-800 shadow-xl">
          <div className="px-3 py-2 rounded-lg bg-slate-800/80 mb-3">
            <div className="text-xs text-slate-400">Signed in as</div>
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

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

