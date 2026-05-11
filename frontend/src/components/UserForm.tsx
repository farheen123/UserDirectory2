import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userFormSchema, type UserFormValues } from '../types/schema';

interface UserFormProps {
  onSubmit: (values: UserFormValues) => Promise<void>;
  isSubmitting: boolean;
  defaultValues?: Partial<UserFormValues>;
  submitLabel?: string;
}

interface FieldProps {
  label: string;
  name: keyof UserFormValues;
  type?: string;
  placeholder?: string;
  error?: string;
  register: ReturnType<typeof useForm<UserFormValues>>['register'];
}

function Field({ label, name, type = 'text', placeholder, error, register }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-light">
        {label}
        <span className="text-danger ml-1">*</span>
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`
          w-full px-4 py-2.5 rounded-lg bg-ink-soft border text-white placeholder-slate-mid/50
          text-sm font-mono transition-all duration-200 outline-none
          focus:border-accent focus:ring-2 focus:ring-accent/20
          ${error ? 'border-danger/60 ring-2 ring-danger/10' : 'border-ink-muted hover:border-slate-mid/40'}
        `}
        {...register(name, type === 'number' ? { valueAsNumber: true } : {})}
      />
      {error && (
        <p id={`${name}-error`} role="alert" className="text-xs text-danger flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

export function UserForm({ onSubmit, isSubmitting, defaultValues, submitLabel = 'Add User' }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: defaultValues ?? { name: '', age: undefined, city: '', state: '', pincode: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <Field label="Full Name" name="name" placeholder="e.g. Jane Smith" error={errors.name?.message} register={register} />

      <Field label="Age" name="age" type="number" placeholder="e.g. 28" error={errors.age?.message} register={register} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="City" name="city" placeholder="e.g. Sydney" error={errors.city?.message} register={register} />
        <Field label="State" name="state" placeholder="e.g. NSW" error={errors.state?.message} register={register} />
      </div>

      <Field label="Pincode" name="pincode" placeholder="e.g. 2000" error={errors.pincode?.message} register={register} />

      <button
        type="submit"
        disabled={isSubmitting}
        className="
          mt-2 w-full py-3 px-6 rounded-xl font-semibold text-sm text-white
          bg-accent hover:bg-accent-light active:scale-[0.98]
          shadow-lg shadow-accent/20 transition-all duration-200
          disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100
          flex items-center justify-center gap-2
        "
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Saving…
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}
