import { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Breadcrumbs from '../components/Breadcrumbs';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    const { data } = await supabase
      .from('faqs')
      .select('*')
      .order('order_index', { ascending: true });

    if (data) {
      setFaqs(data);
    }
    setLoading(false);
  };

  const categories = ['all', ...new Set(faqs.map(faq => faq.category))];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-500/30 border-t-gray-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-black via-gray-950 to-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs />

        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="w-12 h-12 text-gray-400" />
            <h1 className="text-5xl font-bold">
              <span className="bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                FAQ
              </span>
            </h1>
          </div>
          <p className="text-xl text-gray-400">
            Find answers to common questions
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500/50 transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-gray-600 to-gray-500 text-white'
                    : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700'
                }`}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredFAQs.map(faq => (
            <div
              key={faq.id}
              className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-800/30 transition-colors"
              >
                <span className="font-medium pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                    openFAQ === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFAQ === faq.id && (
                <div className="px-5 pb-5 pt-0">
                  <div className="pt-3 border-t border-gray-800 text-gray-400">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400">No FAQs found matching your search</p>
          </div>
        )}

        <div className="mt-12 p-6 bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-gray-800 rounded-lg text-center">
          <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
          <p className="text-gray-400 mb-4">
            Our support team is here to help you 24/7
          </p>
          <a
            href="/contact"
            className="inline-block bg-gradient-to-r from-gray-600 to-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:from-gray-500 hover:to-gray-400 transition-all"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}
