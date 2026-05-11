import { z } from 'zod';

export const userFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  age: z
    .number({ invalid_type_error: 'Age must be a number' })
    .int('Age must be a whole number')
    .min(0, 'Age must be at least 0')
    .max(120, 'Age must be at most 120'),
  city: z
    .string()
    .min(1, 'City is required')
    .max(100, 'City must not exceed 100 characters'),
  state: z
    .string()
    .min(1, 'State is required')
    .max(100, 'State must not exceed 100 characters'),
  pincode: z
    .string()
    .min(4, 'Pincode must be at least 4 characters')
    .max(10, 'Pincode must not exceed 10 characters')
    .regex(/^[A-Za-z0-9\s\-]+$/, 'Pincode contains invalid characters'),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
