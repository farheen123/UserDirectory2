import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { userService } from '../services/userService';

const mockUser = {
  id: 1,
  name: 'Alice',
  age: 30,
  city: 'Sydney',
  state: 'NSW',
  pincode: '2000',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('userService', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('getAll', () => {
    it('returns users on success', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => [mockUser],
      } as Response);

      const users = await userService.getAll();
      expect(users).toHaveLength(1);
      expect(users[0].name).toBe('Alice');
    });

    it('throws on non-ok response', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Server error' }),
      } as Response);

      await expect(userService.getAll()).rejects.toThrow('Server error');
    });
  });

  describe('create', () => {
    it('POSTs with correct payload and returns user', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockUser,
      } as Response);

      const payload = { name: 'Alice', age: 30, city: 'Sydney', state: 'NSW', pincode: '2000' };
      const user = await userService.create(payload);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      );
      expect(user.name).toBe('Alice');
    });

    it('throws validation error on 400', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Validation failed', errors: [{ field: 'Name', message: 'Too short' }] }),
      } as Response);

      await expect(userService.create({ name: 'A', age: 30, city: 'X', state: 'Y', pincode: '1234' }))
        .rejects.toThrow('Validation failed');
    });
  });

  describe('delete', () => {
    it('sends DELETE request', async () => {
      vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);
      await userService.delete(1);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/users/1'), { method: 'DELETE' });
    });

    it('throws on failure', async () => {
      vi.mocked(fetch).mockResolvedValue({ ok: false, status: 404 } as Response);
      await expect(userService.delete(999)).rejects.toThrow('HTTP 404');
    });
  });
});
