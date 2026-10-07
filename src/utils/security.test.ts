import { describe, expect, it, vi } from 'vitest';
import { clearSecureSession, createSecureSession, getSecureSession } from './security';

describe('UI session metadata', () => {
  it('is session-scoped and removes legacy local-storage credentials', () => {
    localStorage.setItem('triiply_jwt_token', 'legacy-jwt');
    localStorage.setItem('triiply_session_token', 'legacy-session');

    createSecureSession('admin', 'admin', 'admin@example.com');

    expect(getSecureSession()).toEqual({ userId: 'admin', role: 'admin', email: 'admin@example.com' });
    expect(localStorage.getItem('triiply_jwt_token')).toBeNull();
    expect(localStorage.getItem('triiply_session_token')).toBeNull();
    expect(sessionStorage.length).toBe(1);
  });

  it('expires and clears stale UI metadata', () => {
    vi.spyOn(Date, 'now').mockReturnValueOnce(1_000).mockReturnValue(3_602_000);
    createSecureSession('admin', 'admin', 'admin@example.com');

    expect(getSecureSession()).toBeNull();
    expect(sessionStorage.length).toBe(0);
    vi.restoreAllMocks();
  });

  it('clears both current and legacy session values', () => {
    createSecureSession('admin', 'admin', 'admin@example.com');
    localStorage.setItem('triiply_jwt_token', 'legacy-jwt');
    clearSecureSession();
    expect(sessionStorage.length).toBe(0);
    expect(localStorage.getItem('triiply_jwt_token')).toBeNull();
  });
});
