import { describe, it, expect } from 'vitest';
import { userFormSchema } from '../types/schema';

describe('userFormSchema', () => {
  const valid = {
    name: 'Jane Doe',
    age: 28,
    city: 'Sydney',
    state: 'NSW',
    pincode: '2000',
  };

  it('accepts valid data', () => {
    const result = userFormSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  describe('name', () => {
    it('rejects single character name', () => {
      const result = userFormSchema.safeParse({ ...valid, name: 'A' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path[0]).toBe('name');
      }
    });

    it('rejects empty name', () => {
      const result = userFormSchema.safeParse({ ...valid, name: '' });
      expect(result.success).toBe(false);
    });

    it('accepts name at minimum length', () => {
      const result = userFormSchema.safeParse({ ...valid, name: 'Al' });
      expect(result.success).toBe(true);
    });

    it('rejects name exceeding 100 chars', () => {
      const result = userFormSchema.safeParse({ ...valid, name: 'A'.repeat(101) });
      expect(result.success).toBe(false);
    });
  });

  describe('age', () => {
    it('rejects age below 0', () => {
      const result = userFormSchema.safeParse({ ...valid, age: -1 });
      expect(result.success).toBe(false);
    });

    it('rejects age above 120', () => {
      const result = userFormSchema.safeParse({ ...valid, age: 121 });
      expect(result.success).toBe(false);
    });

    it('accepts age 0', () => {
      const result = userFormSchema.safeParse({ ...valid, age: 0 });
      expect(result.success).toBe(true);
    });

    it('accepts age 120', () => {
      const result = userFormSchema.safeParse({ ...valid, age: 120 });
      expect(result.success).toBe(true);
    });
  });

  describe('pincode', () => {
    it('rejects pincode shorter than 4 chars', () => {
      const result = userFormSchema.safeParse({ ...valid, pincode: '12' });
      expect(result.success).toBe(false);
    });

    it('rejects pincode longer than 10 chars', () => {
      const result = userFormSchema.safeParse({ ...valid, pincode: '12345678901' });
      expect(result.success).toBe(false);
    });

    it('accepts pincode at min length', () => {
      const result = userFormSchema.safeParse({ ...valid, pincode: '1234' });
      expect(result.success).toBe(true);
    });

    it('accepts pincode at max length', () => {
      const result = userFormSchema.safeParse({ ...valid, pincode: '1234567890' });
      expect(result.success).toBe(true);
    });

    it('rejects pincode with invalid characters', () => {
      const result = userFormSchema.safeParse({ ...valid, pincode: '1234@' });
      expect(result.success).toBe(false);
    });
  });

  describe('city and state', () => {
    it('rejects empty city', () => {
      const result = userFormSchema.safeParse({ ...valid, city: '' });
      expect(result.success).toBe(false);
    });

    it('rejects empty state', () => {
      const result = userFormSchema.safeParse({ ...valid, state: '' });
      expect(result.success).toBe(false);
    });
  });
});
