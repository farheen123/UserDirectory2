import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger">
      <AlertCircle size={18} className="mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="shrink-0 flex items-center gap-1.5 text-xs font-medium hover:opacity-80 transition-opacity"
        >
          <RefreshCw size={13} />
          Retry
        </button>
      )}
    </div>
  );
}
