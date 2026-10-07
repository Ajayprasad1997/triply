import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from './api';

describe('ApiClient authentication transport', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('uses credentialed HTTP-only cookie transport without an Authorization header', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, user: { userId: 'admin', role: 'admin' } })
    });
    vi.stubGlobal('fetch', fetchMock);

    await api.getMe();

    expect(fetchMock).toHaveBeenCalledOnce();
    const [, options] = fetchMock.mock.calls[0];
    expect(options.credentials).toBe('include');
    expect(options.headers).not.toHaveProperty('Authorization');
  });

  it('does not persist a token returned by a legacy login response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, token: 'must-not-be-stored', user: { role: 'admin' } })
    }));

    await api.login({ email: 'admin@example.com', password: 'valid-password' });

    expect(localStorage.getItem('triiply_jwt_token')).toBeNull();
  });
});

describe('ApiClient document uploads', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('replaces an opaque storage fetch failure with an actionable error', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          uploadUrl: 'https://storage.example.com/signed-upload',
          publicUrl: 'https://cdn.example.com/document.pdf',
          key: 'partner-verification/document.pdf'
        })
      })
      .mockRejectedValueOnce(new TypeError('Failed to fetch'));
    vi.stubGlobal('fetch', fetchMock);

    const file = new File(['test document'], 'document.pdf', { type: 'application/pdf' });

    await expect(api.createFileUpload(file, 'registration-certificate'))
      .rejects
      .toThrow('Document upload could not reach secure storage.');
  });

  it('uploads with only the content type required by the signed request', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          uploadUrl: 'https://storage.example.com/signed-upload',
          publicUrl: 'https://cdn.example.com/image.jpg',
          key: 'uploads/image.jpg'
        })
      })
      .mockResolvedValueOnce({ ok: true });
    vi.stubGlobal('fetch', fetchMock);

    const file = new File(['image'], 'image.jpg', { type: 'image/jpeg' });
    await api.createImageUpload(file, 'package-covers');

    expect(fetchMock.mock.calls[1][1]).toMatchObject({
      method: 'PUT',
      headers: { 'Content-Type': 'image/jpeg' },
      body: file
    });
  });

  it('surfaces the storage error code when a signed upload is rejected', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          uploadUrl: 'https://storage.example.com/signed-upload',
          publicUrl: 'https://cdn.example.com/image.jpg',
          key: 'uploads/image.jpg'
        })
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 403,
        text: async () => '<Error><Code>SignatureDoesNotMatch</Code></Error>'
      });
    vi.stubGlobal('fetch', fetchMock);

    const file = new File(['image'], 'image.jpg', { type: 'image/jpeg' });
    await expect(api.createImageUpload(file, 'package-covers'))
      .rejects
      .toThrow('SignatureDoesNotMatch');
  });
});
