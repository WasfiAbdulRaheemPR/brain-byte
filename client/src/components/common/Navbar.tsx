import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  ShieldAlert,
  Menu,
  X,
  FilePlus2,
  Search,
  User,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-brand-navy flex items-center justify-center text-brand-teal group-hover:scale-105 transition-transform shadow-sm">
                <ShieldAlert className="w-6 h-6 text-brand-teal" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-brand-navy flex items-center gap-1">
                  Civic<span className="text-brand-teal">Connect</span>
                </span>
                <span className="hidden sm:block text-[10px] text-brand-muted tracking-wide font-medium uppercase">
                  Community Resolution Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex ml-10 space-x-6">
              <Link
                to="/"
                className="text-sm font-medium text-brand-text hover:text-brand-teal transition-colors"
              >
                Overview
              </Link>
              <a
                href="/#how-it-works"
                className="text-sm font-medium text-brand-muted hover:text-brand-text transition-colors"
              >
                How It Works
              </a>
              <a
                href="/#categories"
                className="text-sm font-medium text-brand-muted hover:text-brand-text transition-colors"
              >
                Categories
              </a>
              <Link
                to="/track"
                className="text-sm font-medium text-brand-muted hover:text-brand-text flex items-center gap-1 transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                Track Issue
              </Link>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isAdmin ? (
                  <Link to="/admin/dashboard">
                    <Button variant="outline" size="sm" leftIcon={<ShieldCheck className="w-4 h-4 text-brand-teal" />}>
                      Admin Console
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/citizen/submit">
                      <Button variant="secondary" size="sm" leftIcon={<FilePlus2 className="w-4 h-4" />}>
                        Report Issue
                      </Button>
                    </Link>
                    <Link to="/citizen/dashboard">
                      <Button variant="outline" size="sm" leftIcon={<LayoutDashboard className="w-4 h-4" />}>
                        My Dashboard
                      </Button>
                    </Link>
                  </>
                )}

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-brand-navy leading-none">
                      {user?.fullName}
                    </div>
                    <span className="text-[10px] font-medium text-brand-teal uppercase tracking-wider">
                      {user?.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-slate-400 hover:text-brand-danger rounded-md hover:bg-slate-100 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/track">
                  <Button variant="ghost" size="sm" leftIcon={<Search className="w-4 h-4" />}>
                    Track
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="sm" leftIcon={<User className="w-4 h-4" />}>
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Citizen Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-brand-muted hover:text-brand-text hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-brand-text hover:bg-slate-50"
          >
            Overview
          </Link>
          <a
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-brand-muted hover:bg-slate-50"
          >
            How It Works
          </a>
          <a
            href="/#categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-brand-muted hover:bg-slate-50"
          >
            Categories
          </a>
          <Link
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-brand-muted hover:bg-slate-50"
          >
            Track Issue
          </Link>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            {isAuthenticated ? (
              <>
                <div className="px-3 py-1 text-xs text-brand-muted">
                  Signed in as <strong className="text-brand-navy">{user?.fullName}</strong> ({user?.role})
                </div>
                {isAdmin ? (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-2 px-4 rounded-lg bg-brand-navy text-white text-sm font-medium"
                  >
                    Admin Console
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/citizen/submit"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center py-2 px-4 rounded-lg bg-brand-teal text-white text-sm font-medium"
                    >
                      Report a Problem
                    </Link>
                    <Link
                      to="/citizen/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center py-2 px-4 rounded-lg border border-slate-300 text-brand-text text-sm font-medium"
                    >
                      My Dashboard
                    </Link>
                  </>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-center py-2 px-4 rounded-lg text-brand-danger hover:bg-red-50 text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 px-4 rounded-lg border border-slate-300 text-brand-text text-sm font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 px-4 rounded-lg bg-brand-navy text-white text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

