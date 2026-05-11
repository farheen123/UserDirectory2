import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6">
      <p className="text-8xl font-semibold text-ink-muted font-mono">404</p>
      <h1 className="text-xl font-semibold text-white">Page not found</h1>
      <p className="text-sm text-slate-mid">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="mt-4 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-light text-white text-sm font-semibold shadow-lg shadow-accent/20 transition-all"
      >
        Go home
      </Link>
    </main>
  );
}
