import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ type = 'info', title, message, className = '' }) => {
  const styles = {
    info: 'bg-blue-50 text-blue-900 border-blue-200',
    success: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    warning: 'bg-amber-50 text-amber-900 border-amber-200',
    error: 'bg-red-50 text-red-900 border-red-200',
  };

  const icons = {
    info: <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />,
    error: <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />,
  };

  return (
    <div className={`p-4 rounded-lg border flex gap-3 ${styles[type]} ${className}`} role="alert">
      {icons[type]}
      <div className="text-sm">
        {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
        <p className="leading-relaxed">{message}</p>
      </div>
    </div>
  );
};
