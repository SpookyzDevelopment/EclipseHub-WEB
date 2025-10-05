import { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Contact() {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('normal');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please sign in to submit a support ticket');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: submitError } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          subject,
          message,
          priority,
          status: 'open',
        });

      if (submitError) throw submitError;

      await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'support',
        title: 'Support Ticket Received',
        message: 'We have received your support ticket and will respond within 24 hours.',
        read: false,
      });

      setSuccess(true);
      setSubject('');
      setMessage('');
      setPriority('normal');

      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-[#050013] via-[#0b0121] to-[#050013] min-h-screen">
      <div className="max-w-3xl mx-auto">
        <Breadcrumbs />

        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquare className="w-12 h-12 text-sky-300" />
            <h1 className="text-5xl font-bold">
              <span className="bg-gradient-to-r from-fuchsia-300 via-purple-200 to-sky-200 bg-clip-text text-transparent">
                Contact Support
              </span>
            </h1>
          </div>
          <p className="text-xl text-violet-100/80">
            We’re here to help. Submit a ticket and the Eclipse Hub success pod will respond within one business day.
          </p>
        </div>

        {success ? (
          <div className="bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-emerald-500/20 border border-emerald-400/30 rounded-2xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Ticket Submitted!</h2>
            <p className="text-violet-100/80 mb-4">
              We’ve received your support ticket and will get back to you shortly with next steps.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-400 text-white px-6 py-3 rounded-xl font-medium hover:from-fuchsia-400 hover:via-purple-400 hover:to-sky-300 transition-all"
            >
              Submit Another Ticket
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white/10 border border-white/15 rounded-2xl p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-violet-100/80 mb-2">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['low', 'normal', 'high'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`px-4 py-3 rounded-lg font-medium transition-all ${
                        priority === p
                          ? 'bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-400 text-white shadow-[0_15px_35px_rgba(124,58,237,0.35)]'
                          : 'bg-[#08001c] text-violet-100/70 border border-white/10 hover:border-fuchsia-400/40'
                      }`}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-violet-100/80 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full bg-[#08001c] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-violet-100/40 focus:border-fuchsia-400/40 transition-colors"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-violet-100/80 mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={8}
                  className="w-full bg-[#08001c] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-violet-100/40 focus:border-fuchsia-400/40 transition-colors resize-none"
                  placeholder="Provide as much detail as possible about your issue..."
                  required
                />
              </div>

              {error && (
                <div className="mb-6 p-4 bg-rose-500/15 border border-rose-400/30 rounded-xl text-rose-200 text-sm">
                  {error}
                </div>
              )}

              {!user && (
                <div className="mb-6 p-4 bg-amber-400/15 border border-amber-300/30 rounded-xl text-amber-200 text-sm">
                  Please sign in to submit a support ticket
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !user}
                className="w-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-400 text-white py-3 rounded-xl font-medium hover:from-fuchsia-400 hover:via-purple-400 hover:to-sky-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                {loading ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </div>

            <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 border border-white/15 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-sky-300" />
                Other Ways to Reach Us
              </h3>
              <div className="space-y-2 text-violet-100/80">
                <p>Email: support@eclipcestore.digital</p>
                <p>Live Chat: Available 24/7 (Premium customers)</p>
                <p>Response Time: Within 24 hours</p>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
