import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Package, CheckCircle } from 'lucide-react';
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
      wishlist = wishlist.filter(pid => pid !== id);
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
      user_id: 'guest'
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

  const averageRating = product?.rating || (reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-16 px-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  if (!product) return null;

  const features = Array.isArray(product.features) ? product.features : [];

  return (
    <div className="min-h-screen pt-32 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
            ← Back to Products
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                  />
                ))}
              </div>
              <span className="text-gray-400">({reviews.length} reviews)</span>
            </div>

            <p className="text-gray-300 text-lg mb-6 leading-relaxed">{product.description}</p>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                ${Number(product.price).toFixed(2)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                product.stock_status === 'in_stock'
                  ? 'bg-green-500/20 text-green-400'
                  : product.stock_status === 'low_stock'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {product.stock_status?.replace('_', ' ') || 'In Stock'}
              </span>
            </div>

            {features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock_status === 'out_of_stock'}
                className="flex-1 bg-gradient-to-r from-gray-600 to-gray-500 text-white py-4 rounded-lg font-medium hover:from-gray-500 hover:to-gray-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={toggleWishlist}
                className={`p-4 rounded-lg border transition-all ${
                  inWishlist
                    ? 'bg-red-500/20 border-red-500/50 text-red-400'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-16">
          <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>

          <form onSubmit={handleSubmitReview} className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">Write a Review</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating })}
                      className="p-2 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 ${rating <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Comment</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-gray-600 transition-colors min-h-[100px]"
                  placeholder="Share your thoughts about this product..."
                />
              </div>
              <button
                type="submit"
                disabled={submittingReview}
                className="bg-gradient-to-r from-gray-600 to-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:from-gray-500 hover:to-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>

          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 rounded-lg">
              <Package className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 rounded-lg p-6"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-2">{review.comment}</p>
                  <p className="text-sm text-gray-500">
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
    </div>
  );
}
