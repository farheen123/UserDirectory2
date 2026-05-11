import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import { type User } from '../types/user';

interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { users, loading, error, refresh: fetch };
}
