import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  fullHeight?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Loading...',
  size = 'md',
  fullHeight = false,
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 gap-3 text-brand-muted ${
        fullHeight ? 'min-h-[50vh]' : ''
      }`}
    >
      <Loader2 className={`${sizeMap[size]} animate-spin text-brand-teal`} />
      {label && <p className="text-sm font-medium">{label}</p>}
    </div>
  );
};
