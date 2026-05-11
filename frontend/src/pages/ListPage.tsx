import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserPlus, Trash2, RefreshCw, Users } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { userService } from '../services/userService';
import { Spinner } from '../components/Spinner';
import { ErrorBanner } from '../components/ErrorBanner';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { User } from '../types/user';

export function ListPage() {
  const { users, loading, error, refresh } = useUsers();
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await userService.delete(deleteTarget.id);
      toast.success(`${deleteTarget.name} removed`);
      setDeleteTarget(null);
      refresh();
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">All Users</h1>
          <p className="text-sm text-slate-mid mt-1">
            {loading ? '—' : `${users.length} ${users.length === 1 ? 'user' : 'users'} registered`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            disabled={loading}
            className="p-2.5 rounded-lg border border-ink-muted text-slate-mid hover:text-white hover:border-slate-mid/40 transition-all disabled:opacity-40"
            aria-label="Refresh list"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link
            to="/add"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-light text-white text-sm font-semibold shadow-lg shadow-accent/20 transition-all"
          >
            <UserPlus size={15} />
            Add User
          </Link>
        </div>
      </div>

      {/* Error */}
      {error && <ErrorBanner message={error} onRetry={refresh} />}

      {/* Loading */}
      {loading && !error && (
        <div className="flex justify-center py-20">
          <Spinner size="lg" label="Loading users…" />
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-ink-soft border border-ink-muted flex items-center justify-center">
            <Users size={28} className="text-slate-mid" />
          </div>
          <div className="text-center">
            <p className="font-medium text-white">No users yet</p>
            <p className="text-sm text-slate-mid mt-1">Add your first user to get started</p>
          </div>
          <Link
            to="/add"
            className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-light text-white text-sm font-semibold shadow-lg shadow-accent/20 transition-all"
          >
            <UserPlus size={15} />
            Add First User
          </Link>
        </div>
      )}

      {/* Table */}
      {!loading && !error && users.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-ink-muted">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="bg-ink-soft border-b border-ink-muted">
                {['Name', 'Age', 'City', 'State', 'Pincode', ''].map(h => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-xs font-semibold text-slate-mid uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr
                  key={user.id}
                  className={`border-b border-ink-muted/50 hover:bg-ink-soft/60 transition-colors ${
                    i % 2 === 0 ? 'bg-ink' : 'bg-ink/60'
                  }`}
                >
                  <td className="px-5 py-4 font-medium text-white">{user.name}</td>
                  <td className="px-5 py-4 text-slate-light font-mono">{user.age}</td>
                  <td className="px-5 py-4 text-slate-light">{user.city}</td>
                  <td className="px-5 py-4 text-slate-light">{user.state}</td>
                  <td className="px-5 py-4 font-mono text-slate-light">{user.pincode}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setDeleteTarget(user)}
                      className="p-1.5 rounded-lg text-slate-mid hover:text-danger hover:bg-danger/10 transition-all"
                      aria-label={`Delete ${user.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete User"
        message={`Are you sure you want to remove ${deleteTarget?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </main>
  );
}
