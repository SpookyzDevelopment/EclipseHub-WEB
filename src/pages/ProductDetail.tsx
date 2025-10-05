import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ShoppingCart, Heart, Star, Package, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { supabaseDataService, Product } from '../services/supabaseDataService';
import { addToCart } from '../utils/cart';
import { useAuth } from '../contexts/AuthContext';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await supabaseDataService.getProduct(id!);
      if (!data) {
        navigate('/products');
        return;
      }
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = () => {
    const wishlistData = localStorage.getItem('wishlist');
    let wishlist: string[] = wishlistData ? JSON.parse(wishlistData) : [];

    if (inWishlist) {
      wishlist = wishlist.filter((pid) => pid !== id);
      setInWishlist(false);
    } else {
      wishlist.push(id!);
      setInWishlist(true);
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image_url: product.image_url
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);

    const reviewsData = localStorage.getItem('reviews');
    const allReviews = reviewsData ? JSON.parse(reviewsData) : [];

    const newReviewItem: Review = {
      id: Date.now().toString(),
      rating: newReview.rating,
      comment: newReview.comment,
      created_at: new Date().toISOString(),
      user_id: user?.id || 'guest'
    };

    allReviews.push({ ...newReviewItem, product_id: id });
    localStorage.setItem('reviews', JSON.stringify(allReviews));

    setReviews([newReviewItem, ...reviews]);
    setNewReview({ rating: 5, comment: '' });
    setSubmittingReview(false);
  };

  useEffect(() => {
    const wishlistData = localStorage.getItem('wishlist');
    const wishlist: string[] = wishlistData ? JSON.parse(wishlistData) : [];
    setInWishlist(wishlist.includes(id!));

    const reviewsData = localStorage.getItem('reviews');
    const allReviews = reviewsData ? JSON.parse(reviewsData) : [];
    const productReviews = allReviews.filter((r: any) => r.product_id === id);
    setReviews(productReviews);
  }, [id]);

  const averageRating = product?.rating || (reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-16 px-6 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-white/10 border-t-indigo-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  const features = Array.isArray(product.features) ? product.features : [];

  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-5%] right-[-10%] w-[40rem] h-[40rem] bg-gradient-to-br from-indigo-500/15 via-purple-500/15 to-transparent blur-[220px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        <div className="flex items-center gap-4 text-sm text-slate-300">
          <Link to="/products" className="inline-flex items-center gap-2 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to catalogue
          </Link>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className="uppercase tracking-[0.3em]">Product detail</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="relative rounded-[32px] border border-white/10 bg-white/5 p-4 overflow-hidden">
            <div className="relative aspect-square rounded-[28px] bg-[#060b19]/80 overflow-hidden">
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              {product.is_featured && (
                <div className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white text-xs font-semibold">
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  Featured Drop
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-semibold text-white">{product.name}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-300">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
                    />
                  ))}
                </div>
                <span>({reviews.length} reviews)</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="uppercase tracking-[0.3em] text-xs text-slate-400">{product.category}</span>
              </div>
            </div>

            <p className="text-lg text-slate-300 leading-relaxed bg-white/5 border border-white/10 rounded-3xl p-6">
              {product.description}
            </p>

            <div className="flex items-end gap-4">
              <span className="text-5xl font-semibold text-gradient">${Number(product.price).toFixed(2)}</span>
              <span
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.3em] ${
                  product.stock_status === 'in_stock'
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                    : product.stock_status === 'low_stock'
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                }`}
              >
                {product.stock_status?.replace('_', ' ') || 'In Stock'}
              </span>
            </div>

            {features.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3">
                <h3 className="text-sm uppercase tracking-[0.3em] text-slate-400">What’s inside</h3>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-200">
                      <CheckCircle className="w-4 h-4 text-indigo-200 mt-1" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock_status === 'out_of_stock'}
                className="flex-1 btn-gradient py-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to cart
              </button>
              <button
                onClick={toggleWishlist}
                className={`px-6 py-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  inWishlist
                    ? 'border-rose-400/40 bg-rose-500/10 text-rose-200'
                    : 'border-white/15 bg-white/5 text-slate-200 hover:border-indigo-400/40'
                }`}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                {inWishlist ? 'In wishlist' : 'Save for later'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-2xl font-semibold text-white">Customer reviews</h2>
            <span className="text-sm text-slate-400">Share your experience to help other Eclipse partners.</span>
          </div>

          <form onSubmit={handleSubmitReview} className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm uppercase tracking-[0.3em] text-slate-400">Your rating</h3>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating })}
                    className="p-2 rounded-full hover:bg-white/10 transition"
                  >
                    <Star
                      className={`w-7 h-7 ${rating <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm uppercase tracking-[0.3em] text-slate-400">Your review</h3>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full min-h-[120px] rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:border-indigo-400/40 transition"
                placeholder="Share how Eclipse helped your launch..."
              />
              <button
                type="submit"
                disabled={submittingReview}
                className="btn-gradient px-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submittingReview ? 'Submitting...' : 'Publish review'}
              </button>
            </div>
          </form>

          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-white/5 border border-white/10 rounded-3xl">
              <Package className="w-12 h-12 text-indigo-200 mx-auto mb-4" />
              <p className="text-slate-300">No reviews yet. Be the first to share your story.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">{review.comment}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-[0.25em]">
                    {new Date(review.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
