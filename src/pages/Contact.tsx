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
    <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-black via-gray-950 to-black min-h-screen">
      <div className="max-w-3xl mx-auto">
        <Breadcrumbs />

        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquare className="w-12 h-12 text-gray-400" />
            <h1 className="text-5xl font-bold">
              <span className="bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                Contact Support
              </span>
            </h1>
          </div>
          <p className="text-xl text-gray-400">
            We're here to help. Send us a message and we'll respond within 24 hours.
          </p>
        </div>

        {success ? (
          <div className="bg-gradient-to-br from-green-900/30 to-green-900/10 border border-green-500/30 rounded-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Ticket Submitted!</h2>
            <p className="text-gray-400 mb-4">
              We've received your support ticket and will get back to you within 24 hours.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="bg-gradient-to-r from-gray-600 to-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:from-gray-500 hover:to-gray-400 transition-all"
            >
              Submit Another Ticket
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
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
                          ? 'bg-gradient-to-r from-gray-600 to-gray-500 text-white'
                          : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-gray-600 transition-colors"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={8}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-gray-600 transition-colors resize-none"
                  placeholder="Provide as much detail as possible about your issue..."
                  required
                />
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {!user && (
                <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-sm">
                  Please sign in to submit a support ticket
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !user}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-500 text-white py-3 rounded-lg font-medium hover:from-gray-500 hover:to-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                {loading ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </div>

            <div className="bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-400" />
                Other Ways to Reach Us
              </h3>
              <div className="space-y-2 text-gray-400">
                <p>Email: support@alxne.com</p>
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
