import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Lock, Mail, Shield, Sparkles } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn(email, password);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error || 'Authentication failed');
    }

    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#040011] px-6 py-12">
      <div className="pointer-events-none absolute -top-40 right-0 h-[32rem] w-[32rem] rounded-full bg-purple-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative z-10 flex w-full max-w-5xl flex-col gap-10 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6 text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-purple-100">
            <Sparkles className="h-4 w-4" />
            Eclipse Admin
          </div>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Neon control suite for eclipcestore.digital
          </h1>
          <p className="max-w-xl text-sm text-white/70 sm:text-base">
            Log in with your Eclipse Hub credentials to orchestrate launches, sync inventories, and energize your marketplace in real time.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Real-time oversight</p>
              <p className="mt-2 text-white/80 text-sm">
                Monitor drops, customer flows, and fulfillment health across the entire neon stack.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Secure gateway</p>
              <p className="mt-2 text-white/80 text-sm">
                Protected access with encrypted sessions and admin-level tooling.
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_0_60px_rgba(168,85,247,0.2)] backdrop-blur-2xl">
            <div className="flex flex-col items-center text-center text-white">
              <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-indigo-500">
                <Shield className="h-10 w-10" />
                <span className="absolute -bottom-2 rounded-full bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-purple-100">
                  Portal
                </span>
              </div>
              <h2 className="text-2xl font-semibold">Admin authentication</h2>
              <p className="mt-2 text-sm text-white/60">Enter the credentials configured for Eclipse Hub access.</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6 text-white">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-12 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
                    placeholder="admin@eclipcestore.digital"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-12 py-3 text-sm focus:border-purple-400/60 focus:outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl border border-purple-400/60 bg-gradient-to-r from-purple-500 to-fuchsia-500 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-all hover:shadow-[0_0_35px_rgba(168,85,247,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Entering deck…' : 'Enter command deck'}
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-center text-xs text-white/50">
              Default credentials can be configured through environment variables before deploying.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
