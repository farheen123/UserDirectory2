interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-[3px]',
};

export function Spinner({ size = 'md', label = 'Loading…' }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-label={label}>
      <div
        className={`${sizes[size]} rounded-full border-ink-muted border-t-accent animate-spin`}
      />
      {size === 'lg' && (
        <p className="text-sm text-slate-mid font-medium">{label}</p>
      )}
    </div>
  );
}
