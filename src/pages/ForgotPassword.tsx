import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Envelope } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { TriiplyLogo } from '../components/TriiplyLogo';
import { api } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.forgotPassword(email.trim().toLowerCase());
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to submit the request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <section className="max-w-md w-full space-y-7 bg-white border border-slate-200 p-8 rounded-3xl shadow-xl">
        <div className="text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 mb-6">
            <ArrowLeft size={16} /> Return to login
          </Link>
          <div className="flex justify-center mb-4"><TriiplyLogo className="h-10" showTagline={false} /></div>
          <h1 className="font-heading text-3xl font-extrabold text-slate-900">Password recovery</h1>
          <p className="mt-2 text-sm text-slate-500">
            {submitted ? 'If an account exists, recovery instructions will be sent to that address.' : 'Enter your administrator email address.'}
          </p>
        </div>

        {submitted ? (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-center text-emerald-800">
            <CheckCircle size={32} className="mx-auto mb-2" weight="fill" />
            Request received. You can safely return to the login page.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="recovery-email" className="block text-xs font-extrabold uppercase tracking-wide text-slate-700">Email address</label>
            <div className="relative">
              <Envelope size={18} className="absolute left-3 top-3.5 text-slate-400" />
              <input id="recovery-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-3" />
            </div>
            {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white disabled:opacity-60">
              {loading ? 'Submitting…' : 'Send recovery instructions'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
