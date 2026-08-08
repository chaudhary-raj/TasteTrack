import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar, FaTimes, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import API from '../utils/api';

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

.rd-root {
  --paper: #F2EEE3;
  --surface: #FFFDF8;
  --border: #DED5BF;
  --border-strong: #C7BB9E;
  --ink: #241F19;
  --ink-muted: #746B5C;
  --accent: #C08A1E;
  --accent-dark: #8C6314;
  --accent-soft: #F7E9C4;
  --success: #2F7D4F;
  --success-soft: #E1EFE3;
  --danger: #A3291F;
  --danger-soft: #F2DEDA;
  --font-display: 'Archivo Black', 'Arial Black', -apple-system, sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  min-height: 100vh;
  background: var(--paper);
  background-image: radial-gradient(circle, rgba(36,31,25,0.05) 1px, transparent 1px);
  background-size: 22px 22px;
  font-family: var(--font-body);
  color: var(--ink);
  padding: 40px 20px 80px;
  box-sizing: border-box;
}
.rd-root *, .rd-root *::before, .rd-root *::after { box-sizing: border-box; }
.rd-container { max-width: 760px; margin: 0 auto; }
.rd-back {
  display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--ink-muted);
  background: none; border: none; cursor: pointer; padding: 0; margin-bottom: 18px;
  font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.06em;
}
.rd-back:hover { color: var(--ink); }
.rd-header { margin-bottom: 28px; }
.rd-title {
  font-family: var(--font-display); font-weight: 400; text-transform: uppercase;
  font-size: clamp(22px, 4vw, 30px); letter-spacing: 0.01em; margin: 0 0 8px;color : #000;
}
.rd-address { font-family: var(--font-mono); font-size: 12px; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 0.05em; margin: 0; }
.rd-error {
  background: var(--danger-soft); color: var(--danger); border: 1.5px solid var(--danger);
  padding: 12px 16px; border-radius: 2px; font-size: 14px; font-weight: 600; margin-bottom: 20px;
}
.rd-empty {
  text-align: center; padding: 52px 20px; color: var(--ink-muted); font-size: 14px;
  font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.05em;
  background: var(--surface); border: 1px dashed var(--border-strong); border-radius: 3px;
}
.rd-list { display: flex; flex-direction: column; gap: 16px; }
.rd-skeleton {
  height: 96px; border-radius: 3px;
  background: linear-gradient(90deg, #EDE7D8 25%, #DED5BF 37%, #EDE7D8 63%); background-size: 400% 100%;
  animation: rd-shimmer 1.4s ease infinite;
}
@keyframes rd-shimmer { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }
.rd-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: 3px;
  padding: 18px 20px 18px 28px; position: relative; box-shadow: 3px 3px 0 var(--border-strong);
  display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;
}
.rd-card::before, .rd-card::after {
  content: ""; position: absolute; left: -1px; width: 13px; height: 13px; border-radius: 50%;
  background: var(--paper); border: 1px solid var(--border-strong);
}
.rd-card::before { top: 18px; }
.rd-card::after { bottom: 18px; }
.rd-item-name { font-size: 16px; font-weight: 700; margin: 0 0 4px; }
.rd-item-price { font-family: var(--font-mono); font-size: 13px; color: var(--ink); font-weight: 600; margin: 0 0 6px; }
.rd-item-desc { font-size: 13px; color: var(--ink-muted); margin: 0; line-height: 1.4; }
.rd-reviewed-badge {
  display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700;
  color: var(--success); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 8px;
}
.rd-write-btn {
  flex-shrink: 0; border: 1.5px solid var(--ink); background: var(--ink); color: #fff; border-radius: 2px;
  padding: 10px 18px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
  cursor: pointer; font-family: var(--font-mono); transition: background .15s, border-color .15s;
}
.rd-write-btn:hover { background: var(--accent-dark); border-color: var(--accent-dark); }

.rd-toast-wrap { position: fixed; top: 20px; right: 20px; z-index: 1100; display: flex; flex-direction: column; gap: 10px; }
.rd-toast {
  min-width: 260px; max-width: 360px; padding: 12px 16px; border-radius: 2px; font-size: 13px; font-weight: 600;
  box-shadow: 3px 3px 0 var(--border-strong); font-family: var(--font-mono); animation: rd-slide-in .2s ease-out;
}
.rd-toast-success { background: var(--success-soft); color: var(--success); border: 1.5px solid var(--success); }
.rd-toast-error { background: var(--danger-soft); color: var(--danger); border: 1.5px solid var(--danger); }
@keyframes rd-slide-in { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

.rd-overlay {
  position: fixed; inset: 0; background: rgba(36, 31, 25, 0.55); display: flex; align-items: center;
  justify-content: center; padding: 20px; z-index: 1000; box-sizing: border-box;
}
.rd-modal {
  width: 100%; max-width: 420px; background: var(--surface); border: 1px solid var(--border);
  border-radius: 3px; box-shadow: 4px 4px 0 var(--border-strong); padding: 26px 26px 24px;
  box-sizing: border-box; max-height: 90vh; overflow-y: auto;
}
.rd-modal-header {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
  margin-bottom: 18px; padding-bottom: 16px; border-bottom: 1px dashed var(--border-strong);
}
.rd-modal-title { font-family: var(--font-display); font-weight: 400; text-transform: uppercase; font-size: 17px; margin: 0; letter-spacing: 0.01em; }
.rd-modal-subtitle { font-family: var(--font-mono); font-size: 11px; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 0.05em; margin: 4px 0 0; }
.rd-modal-close { background: none; border: none; color: var(--ink-muted); cursor: pointer; padding: 2px; flex-shrink: 0; }
.rd-modal-close:hover { color: var(--ink); }
.rd-checking { font-family: var(--font-mono); font-size: 12px; color: var(--ink-muted); margin: 0 0 16px; }
.rd-form { display: flex; flex-direction: column; gap: 16px; }
.rd-rating-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.rd-rating-label { font-size: 11px; font-weight: 600; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 0.06em; font-family: var(--font-mono); }
.rd-stars { display: flex; gap: 4px; }
.rd-star-btn { background: none; border: none; cursor: pointer; padding: 2px; color: var(--accent); font-size: 18px; line-height: 1; }
.rd-star-btn:hover { color: var(--accent-dark); }
.rd-field { display: flex; flex-direction: column; gap: 6px; }
.rd-field label { font-size: 11px; font-weight: 600; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 0.06em; font-family: var(--font-mono); }
.rd-textarea {
  padding: 10px 12px; border: 1px solid var(--border-strong); border-radius: 2px; font-size: 14px;
  color: var(--ink); background: #fff; font-family: var(--font-body); resize: vertical; min-height: 80px;
  transition: border-color .15s, box-shadow .15s;
}
.rd-textarea:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
.rd-modal-actions { display: flex; gap: 10px; margin-top: 4px; }
.rd-btn { flex: 1; padding: 11px; border-radius: 2px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; cursor: pointer; font-family: var(--font-mono); transition: background .15s, color .15s, border-color .15s; }
.rd-btn:disabled { opacity: .6; cursor: not-allowed; }
.rd-btn-primary { border: 1.5px solid var(--ink); background: var(--ink); color: #fff; }
.rd-btn-primary:hover:not(:disabled) { background: var(--accent-dark); border-color: var(--accent-dark); }
.rd-btn-secondary { border: 1.5px solid var(--border-strong); background: transparent; color: var(--ink-muted); }
.rd-btn-secondary:hover:not(:disabled) { color: var(--ink); border-color: var(--ink); }
`;

const StarRating = ({ label, value, onChange }) => (
  <div className="rd-rating-row">
    <span className="rd-rating-label">{label}</span>
    <div className="rd-stars" role="radiogroup" aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n === 1 ? '' : 's'}`}
          className="rd-star-btn"
          onClick={() => onChange(n)}
        >
          {n <= value ? <FaStar /> : <FaRegStar />}
        </button>
      ))}
    </div>
  </div>
);

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewedItemIds, setReviewedItemIds] = useState(() => new Set());

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [checkingExisting, setCheckingExisting] = useState(false);
  const [saving, setSaving] = useState(false);

  // Review form state
  const [tasteRating, setTasteRating] = useState(5);
  const [priceRating, setPriceRating] = useState(5);
  const [cleanlinessRating, setCleanlinessRating] = useState(5);
  const [comment, setComment] = useState('');

  const [toast, setToast] = useState(null); // { type: 'success' | 'error', text }

  useEffect(() => {
    const fetchFoodItems = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await API.get(`/food-items/${id}`);
        setRestaurant(data.restaurant);
        setFoodItems(Array.isArray(data.foodItems) ? data.foodItems : []);
      } catch (err) {
        setError('Failed to load menu items.');
      } finally {
        setLoading(false);
      }
    };
    fetchFoodItems();
  }, [id]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!isModalOpen) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isModalOpen]);

  const openReviewModal = async (item) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Reset to defaults before checking for an existing review — otherwise
    // ratings left over from a previously opened item leak into this one.
    setActiveItem(item);
    setTasteRating(5);
    setPriceRating(5);
    setCleanlinessRating(5);
    setComment('');
    setIsModalOpen(true);
    setCheckingExisting(true);

    try {
      const { data } = await API.get(`/reviews/my-review/${item._id}`);
      if (data.hasReview) {
        setTasteRating(data.review.tasteRating);
        setPriceRating(data.review.priceRating);
        setCleanlinessRating(data.review.cleanlinessRating);
        setComment(data.review.comment || '');
        setReviewedItemIds((prev) => new Set(prev).add(item._id));
      }
    } catch (err) {
      console.error('Error fetching existing review', err);
    } finally {
      setCheckingExisting(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post('/reviews', {
        itemId: activeItem._id,
        tasteRating,
        priceRating,
        cleanlinessRating,
        comment,
      });
      setReviewedItemIds((prev) => new Set(prev).add(activeItem._id));
      setIsModalOpen(false);
      setToast({ type: 'success', text: 'Review saved successfully!' });
    } catch (err) {
      setToast({
        type: 'error',
        text: err.response?.data?.message || err.response?.data?.error || 'Failed to submit review.',
      });
    } finally {
      setSaving(false);
    }
  };

  const closeOnBackdrop = (e) => {
    if (e.target === e.currentTarget) setIsModalOpen(false);
  };

  return (
    <div className="rd-root">
      <style>{STYLES}</style>

      {toast && (
        <div className="rd-toast-wrap">
          <div className={`rd-toast ${toast.type === 'success' ? 'rd-toast-success' : 'rd-toast-error'}`}>
            {toast.text}
          </div>
        </div>
      )}

      <div className="rd-container">
        <button type="button" className="rd-back" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        <div className="rd-header">
          <h2 className="rd-title">{restaurant?.name || 'Restaurant'}</h2>
          {(restaurant?.address || restaurant?.contactInfo) && (
            <p className="rd-address">
              {[
                restaurant?.address ? `Address: ${restaurant.address}` : null,
                restaurant?.contactInfo ? `Mob: ${restaurant.contactInfo}` : null
              ]
                .filter(Boolean)
                .join(' • ')}
            </p>
          )}
        </div>

        {error && <div className="rd-error">{error}</div>}

        {loading && (
          <div className="rd-list">
            <div className="rd-skeleton" />
            <div className="rd-skeleton" />
            <div className="rd-skeleton" />
          </div>
        )}

        {!loading && !error && foodItems.length === 0 && (
          <div className="rd-empty">No menu items listed for this restaurant yet.</div>
        )}

        {!loading && foodItems.length > 0 && (
          <div className="rd-list">
            {foodItems.map((item) => (
              <div key={item._id} className="rd-card">
                <div>
                  <h3 className="rd-item-name">{item.name}</h3>
                  <p className="rd-item-price">₹{item.price}</p>
                  {item.description && <p className="rd-item-desc">{item.description}</p>}
                  {reviewedItemIds.has(item._id) && (
                    <span className="rd-reviewed-badge">
                      <FaCheckCircle /> You reviewed this
                    </span>
                  )}
                </div>
                <button type="button" className="rd-write-btn" onClick={() => openReviewModal(item)}>
                  {reviewedItemIds.has(item._id) ? 'Edit Review' : 'Write a Review'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="rd-overlay" onMouseDown={closeOnBackdrop}>
          <div className="rd-modal">
            <div className="rd-modal-header">
              <div>
                <h3 className="rd-modal-title">Review</h3>
                <p className="rd-modal-subtitle">{activeItem?.name}</p>
              </div>
              <button
                type="button"
                className="rd-modal-close"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {checkingExisting && <p className="rd-checking">Checking for an existing review…</p>}

            <form onSubmit={handleReviewSubmit} className="rd-form">
              <StarRating label="Taste" value={tasteRating} onChange={setTasteRating} />
              <StarRating label="Price" value={priceRating} onChange={setPriceRating} />
              <StarRating label="Cleanliness" value={cleanlinessRating} onChange={setCleanlinessRating} />

              <div className="rd-field">
                <label htmlFor="comment">Comment</label>
                <textarea
                  id="comment"
                  className="rd-textarea"
                  placeholder="What did you think?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <div className="rd-modal-actions">
                <button type="submit" className="rd-btn rd-btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Review'}
                </button>
                <button
                  type="button"
                  className="rd-btn rd-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails;