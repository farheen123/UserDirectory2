import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { UserForm } from '../components/UserForm';
import { userService } from '../services/userService';
import type { UserFormValues } from '../types/schema';

export function AddPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: UserFormValues) => {
    setIsSubmitting(true);
    try {
      await userService.create(values);
      toast.success(`${values.name} added successfully!`, {
        duration: 3000,
        icon: '🎉',
      });
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add user';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-mid hover:text-white transition-colors mb-8"
      >
        <ArrowLeft size={15} />
        Back to list
      </button>

      {/* Card */}
      <div className="bg-ink-soft border border-ink-muted rounded-2xl p-8">
        <div className="mb-7">
          <h1 className="text-2xl font-semibold text-white tracking-tight">Add New User</h1>
          <p className="text-sm text-slate-mid mt-1.5">
            Fill in the details below. All fields are required.
          </p>
        </div>

        <UserForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </main>
  );
}
