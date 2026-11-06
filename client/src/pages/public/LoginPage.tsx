import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'admin') {
      setEmail('admin@civicconnect.gov');
      setPassword('AdminSecure2026!');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await login(email, password);
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

      if (from) {
        navigate(from, { replace: true });
      } else if (user?.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/citizen/dashboard', { replace: true });
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (role: 'citizen' | 'admin') => {
    if (role === 'admin') {
      setEmail('admin@civicconnect.gov');
      setPassword('AdminSecure2026!');
    } else {
      setEmail('citizen@example.com');
      setPassword('CitizenSecure2026!');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-brand-bg">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 group mb-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-navy flex items-center justify-center text-brand-teal group-hover:scale-105 transition-transform shadow-md">
            <ShieldAlert className="w-7 h-7" />
          </div>
        </Link>
        <h2 className="text-3xl font-extrabold text-brand-navy tracking-tight">
          Sign In to CivicConnect
        </h2>
        <p className="mt-2 text-sm text-brand-muted">
          Access your citizen complaints or municipal authority portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-slate-200">
          {error && <Alert type="error" message={error} className="mb-6" />}

          {/* Quick Demo Credentials Bar for Judges & Evaluators */}
          <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-bold uppercase tracking-wider text-brand-navy mb-2 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
              Demo Accounts (One-Click Fill)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('citizen')}
                className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 font-medium text-brand-navy flex items-center justify-center gap-1.5 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-brand-teal" />
                Citizen Demo
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('admin')}
                className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 font-medium text-brand-navy flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                Admin Demo
              </button>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-brand-navy uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent text-brand-text"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-brand-navy uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent text-brand-text"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-brand-muted">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-brand-teal hover:text-brand-teal-dark">
              Register as a Citizen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

