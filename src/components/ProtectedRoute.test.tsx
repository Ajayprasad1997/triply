import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ProtectedRoute } from './ProtectedRoute';

const { getMe } = vi.hoisted(() => ({ getMe: vi.fn() }));
vi.mock('../services/api', () => ({ api: { getMe } }));

const renderRoute = () => render(
  <MemoryRouter initialEntries={['/admin/packages']}>
    <Routes>
      <Route path="/login" element={<div>Login page</div>} />
      <Route path="/admin/packages" element={
        <ProtectedRoute allowedRole="admin"><div>Admin packages</div></ProtectedRoute>
      } />
    </Routes>
  </MemoryRouter>
);

describe('ProtectedRoute', () => {
  it('renders protected content only after backend session validation', async () => {
    getMe.mockResolvedValueOnce({ success: true, user: { userId: 'admin', role: 'admin', email: 'admin@example.com' } });
    renderRoute();
    expect(screen.getByRole('status')).toHaveTextContent('Validating admin session');
    expect(await screen.findByText('Admin packages')).toBeInTheDocument();
  });

  it('redirects to login when backend validation fails', async () => {
    getMe.mockRejectedValueOnce(new Error('Unauthorized'));
    renderRoute();
    await waitFor(() => expect(screen.getByText('Login page')).toBeInTheDocument());
    expect(screen.queryByText('Admin packages')).not.toBeInTheDocument();
  });
});
