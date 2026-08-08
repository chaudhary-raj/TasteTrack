import { useState, useEffect } from 'react';
import API from '../utils/api';

const TABS = ['pending', 'approved', 'rejected'];

const RATING_FIELDS = [
  { key: 'tasteRating', label: 'Taste' },
  { key: 'priceRating', label: 'Price' },
  { key: 'cleanlinessRating', label: 'Cleanliness' },
];

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function ratingTone(score) {
  if (score >= 4) return 'good';
  if (score === 3) return 'mid';
  return 'bad';
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

.adm-root {
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
  --warning: #B0611E;
  --warning-soft: #F6E4D2;
  --danger: #A3291F;
  --danger-soft: #F2DEDA;
  --radius: 3px;
  --font-display: 'Archivo Black', 'Arial Black', -apple-system, sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-family: var(--font-body);
  background: var(--paper);
  background-image:
    radial-gradient(circle, rgba(36,31,25,0.05) 1px, transparent 1px);
  background-size: 22px 22px;
  color: var(--ink);
  min-height: 100vh;
  padding: 36px 20px 90px;
}
.adm-container { max-width: 980px; margin: 0 auto; }
.adm-header { text-align: center; margin-bottom: 36px; }
.adm-header h1 {
  font-family: var(--font-display); font-size: 27px; font-weight: 400; text-transform: uppercase;
  letter-spacing: 0.03em; margin: 0 0 8px; color: var(--ink);
}
.adm-header p {
  color: var(--ink-muted); font-size: 12px; margin: 0; font-family: var(--font-mono);
  text-transform: uppercase; letter-spacing: 0.12em;
}
.adm-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-bottom: 48px; }
.adm-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 24px; box-shadow: 3px 3px 0 var(--border-strong); position: relative;
}
.adm-card h2 {
  font-family: var(--font-mono); font-size: 12px; font-weight: 600; margin: 0 0 20px;
  text-transform: uppercase; letter-spacing: 0.1em; color: var(--ink-muted);
  padding-bottom: 12px; border-bottom: 1px dashed var(--border-strong);
}
.adm-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.adm-field label {
  font-size: 11px; font-weight: 600; color: var(--ink-muted); text-transform: uppercase;
  letter-spacing: 0.06em; font-family: var(--font-mono);
}
.adm-input, .adm-select, .adm-textarea {
  padding: 10px 12px; border: 1px solid var(--border-strong); border-radius: 2px; font-size: 14px;
  color: var(--ink); background: #fff; transition: border-color .15s, box-shadow .15s; font-family: var(--font-body);
}
.adm-input:focus, .adm-select:focus, .adm-textarea:focus {
  outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft);
}
.adm-textarea { resize: vertical; min-height: 80px; }
.adm-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  padding: 10px 16px; border: 1.5px solid transparent; border-radius: 2px; font-size: 12px; font-weight: 700;
  cursor: pointer; transition: transform .1s, background .15s, color .15s; font-family: var(--font-mono);
  text-transform: uppercase; letter-spacing: 0.08em;
}
.adm-btn:active:not(:disabled) { transform: translateY(1px) scale(0.98); }
.adm-btn:disabled { opacity: .55; cursor: not-allowed; }
.adm-btn-primary { background: var(--ink); border-color: var(--ink); color: #fff; }
.adm-btn-primary:hover:not(:disabled) { background: var(--accent-dark); border-color: var(--accent-dark); }
.adm-btn-success { background: transparent; border-color: var(--success); color: var(--success); }
.adm-btn-success:hover:not(:disabled) { background: var(--success); color: #fff; }
.adm-btn-warning { background: transparent; border-color: var(--warning); color: var(--warning); }
.adm-btn-warning:hover:not(:disabled) { background: var(--warning); color: #fff; }
.adm-btn-danger { background: transparent; border-color: var(--danger); color: var(--danger); }
.adm-btn-danger:hover:not(:disabled) { background: var(--danger); color: #fff; }
.adm-btn-full { width: 100%; margin-top: 6px; }
.adm-tabs { display: flex; gap: 4px; margin-bottom: 22px; border-bottom: 2px solid var(--ink); }
.adm-tab {
  padding: 10px 20px; border: none; background: transparent; font-size: 12px; font-weight: 700;
  color: var(--ink-muted); cursor: pointer; margin-bottom: -2px; font-family: var(--font-mono);
  text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 2px solid transparent;
  transition: color .15s, border-color .15s;
}
.adm-tab:hover { color: var(--ink); }
.adm-tab-active { background: var(--ink); color: #fff; border-color: var(--ink); }
.adm-section-title { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 16px; }
.adm-section-title h2 {
  font-family: var(--font-display); font-size: 18px; font-weight: 400; text-transform: uppercase;
  letter-spacing: 0.02em; margin: 0; color: #000;
}
.adm-count { font-size: 12px; color: var(--ink-muted); font-family: var(--font-mono); }
.adm-empty {
  text-align: center; padding: 52px 20px; color: var(--ink-muted); font-size: 13px;
  font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.06em;
  background: var(--surface); border: 1px dashed var(--border-strong); border-radius: var(--radius);
}
.adm-review-list { display: flex; flex-direction: column; gap: 18px; }
.adm-review {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 20px 22px 20px 30px; position: relative; box-shadow: 3px 3px 0 var(--border-strong);
}
.adm-review::before, .adm-review::after {
  content: ""; position: absolute; left: -1px; width: 13px; height: 13px; border-radius: 50%;
  background: var(--paper); border: 1px solid var(--border-strong);
}
.adm-review::before { top: 20px; }
.adm-review::after { bottom: 20px; }
.adm-review-top {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
  margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px dashed var(--border-strong); flex-wrap: wrap;
}
.adm-review-dish { font-size: 15px; font-weight: 700; margin: 0 0 3px; }
.adm-review-rest { font-size: 12px; color: var(--ink-muted); margin: 0; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.04em; }
.adm-user { display: flex; align-items: center; gap: 8px; }
.adm-avatar {
  width: 30px; height: 30px; border-radius: 50%; background: var(--ink); color: var(--surface);
  display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700;
  flex-shrink: 0; font-family: var(--font-mono);
}
.adm-user-meta { font-size: 12px; color: var(--ink-muted); line-height: 1.3; }
.adm-user-meta strong { color: var(--ink); font-weight: 600; display: block; font-size: 13px; font-family: var(--font-body); }
.adm-anon-badge {
  font-size: 10px; font-weight: 700; padding: 4px 9px; border-radius: 2px; background: var(--ink);
  color: #fff; text-transform: uppercase; letter-spacing: 0.08em; white-space: nowrap; font-family: var(--font-mono);
  transform: rotate(-2deg);
}
.adm-chips { display: flex; gap: 8px; flex-wrap: wrap; margin: 14px 0; }
.adm-chip {
  font-size: 11px; font-weight: 700; padding: 5px 10px; border-radius: 2px; font-family: var(--font-mono);
  text-transform: uppercase; letter-spacing: 0.04em; border: 1.5px solid transparent;
}
.adm-chip-good { background: var(--success-soft); color: var(--success); border-color: var(--success); }
.adm-chip-mid { background: var(--warning-soft); color: var(--warning); border-color: var(--warning); }
.adm-chip-bad { background: var(--danger-soft); color: var(--danger); border-color: var(--danger); }
.adm-comment {
  font-size: 14px; color: var(--ink); line-height: 1.55; font-style: italic; background: var(--paper);
  border-left: 3px solid var(--accent); padding: 10px 14px; border-radius: 2px; margin: 0 0 16px;
}
.adm-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.adm-toast-wrap { position: fixed; top: 20px; right: 20px; z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.adm-toast {
  min-width: 260px; max-width: 360px; padding: 12px 16px; border-radius: 2px; font-size: 13px; font-weight: 600;
  box-shadow: 3px 3px 0 var(--border-strong); animation: adm-slide-in .2s ease-out; font-family: var(--font-mono);
}
.adm-toast-success { background: var(--success-soft); color: var(--success); border: 1.5px solid var(--success); }
.adm-toast-error { background: var(--danger-soft); color: var(--danger); border: 1.5px solid var(--danger); }
@keyframes adm-slide-in { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
.adm-skeleton {
  background: linear-gradient(90deg, #EDE7D8 25%, #DED5BF 37%, #EDE7D8 63%); background-size: 400% 100%;
  animation: adm-shimmer 1.4s ease infinite; border-radius: 2px;
}
.adm-skeleton-review { height: 96px; margin-bottom: 14px; }
@keyframes adm-shimmer { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }
@media (max-width: 600px) {
  .adm-review-top { flex-direction: column; }
  .adm-review { padding-left: 24px; }
}
`;

const AdminDashboard = () => {
  // Restaurant form state
  const [restName, setRestName] = useState('');
  const [address, setAddress] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [savingRestaurant, setSavingRestaurant] = useState(false);

  // Food item form state
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [foodName, setFoodName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [savingFood, setSavingFood] = useState(false);

  // Review moderation state
  const [reviewTab, setReviewTab] = useState('pending');
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Toast notifications
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', text }

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewTab]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  const showSuccess = (text) => setToast({ type: 'success', text });
  const showError = (text) => setToast({ type: 'error', text });

  const fetchRestaurants = async () => {
    setRestaurantsLoading(true);
    try {
      const { data } = await API.get('/restaurants');
      setRestaurants(data);
      if (data.length > 0) setSelectedRestaurant((prev) => prev || data[0]._id);
    } catch (err) {
      console.error('Failed to load restaurants', err);
    } finally {
      setRestaurantsLoading(false);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const { data } = await API.get(`/reviews/admin/queue?status=${reviewTab}`);
      setReviews(data);
    } catch (err) {
      console.error(`Failed to load ${reviewTab} reviews`, err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    setSavingRestaurant(true);
    try {
      await API.post('/restaurants', {
        name: restName,
        address,
        contactInfo,
        imageUrl,
      });
      showSuccess('Restaurant added successfully!');
      setRestName('');
      setAddress('');
      setContactInfo('');
      setImageUrl('');
      fetchRestaurants();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to add restaurant. Please try again.');
    } finally {
      setSavingRestaurant(false);
    }
  };

  const handleAddFoodItem = async (e) => {
    e.preventDefault();

    if (!selectedRestaurant) {
      showError('Please select a restaurant first.');
      return;
    }

    setSavingFood(true);
    try {
      await API.post('/food-items', {
        restaurantId: selectedRestaurant,
        name: foodName,
        description,
        price,
      });
      showSuccess('Food item added successfully!');
      setFoodName('');
      setDescription('');
      setPrice('');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to add food item.');
    } finally {
      setSavingFood(false);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      await API.put(`/reviews/${reviewId}/approve`);
      showSuccess('Review approved and published!');
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      showError('Failed to approve review.');
    }
  };

  const handleReject = async (reviewId) => {
    try {
      await API.put(`/reviews/${reviewId}/reject`);
      showSuccess('Review rejected and hidden from public.');
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      showError('Failed to reject review.');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('This will permanently delete the review from the database. Continue?')) return;
    try {
      await API.delete(`/reviews/${reviewId}`);
      showSuccess('Review permanently deleted.');
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      showError('Failed to delete review.');
    }
  };

  return (
    <div className="adm-root">
      <style>{STYLES}</style>

      {toast && (
        <div className="adm-toast-wrap">
          <div className={`adm-toast ${toast.type === 'success' ? 'adm-toast-success' : 'adm-toast-error'}`}>
            {toast.text}
          </div>
        </div>
      )}

      <div className="adm-container">
        <div className="adm-header">
          <h1>Admin Dashboard</h1>
          <p>Manage campus restaurants, menus, and content moderation</p>
        </div>

        <div className="adm-grid">
          {/* Add Restaurant */}
          <div className="adm-card">
            <h2>Add New Restaurant</h2>
            <form onSubmit={handleAddRestaurant}>
              <div className="adm-field">
                <label htmlFor="rest-name">Restaurant name</label>
                <input
                  id="rest-name"
                  className="adm-input"
                  type="text"
                  placeholder="e.g. Campus Diner"
                  value={restName}
                  onChange={(e) => setRestName(e.target.value)}
                  required
                />
              </div>
              <div className="adm-field">
                <label htmlFor="rest-address">Address / location</label>
                <input
                  id="rest-address"
                  className="adm-input"
                  type="text"
                  placeholder="Building, block, or street"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="adm-field">
                <label htmlFor="rest-contact">Contact info</label>
                <input
                  id="rest-contact"
                  className="adm-input"
                  type="text"
                  placeholder="Phone or email (optional)"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                />
              </div>
              <div className="adm-field">
                <label htmlFor="rest-image">Image URL</label>
                <input
                  id="rest-image"
                  className="adm-input"
                  type="url"
                  placeholder="https:// (optional)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <button type="submit" className="adm-btn adm-btn-primary adm-btn-full" disabled={savingRestaurant}>
                {savingRestaurant ? 'Adding…' : 'Add Restaurant'}
              </button>
            </form>
          </div>

          {/* Add Food Item */}
          <div className="adm-card">
            <h2>Add Food Item</h2>
            <form onSubmit={handleAddFoodItem}>
              <div className="adm-field">
                <label htmlFor="food-restaurant">Restaurant</label>
                <select
                  id="food-restaurant"
                  className="adm-select"
                  value={selectedRestaurant}
                  onChange={(e) => setSelectedRestaurant(e.target.value)}
                  required
                  disabled={restaurantsLoading || restaurants.length === 0}
                >
                  <option value="" disabled>
                    {restaurantsLoading ? 'Loading restaurants…' : 'Select a restaurant…'}
                  </option>
                  {restaurants.map((rest) => (
                    <option key={rest._id} value={rest._id}>
                      {rest.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="adm-field">
                <label htmlFor="food-name">Dish name</label>
                <input
                  id="food-name"
                  className="adm-input"
                  type="text"
                  placeholder="e.g. Cheese Pizza"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  required
                />
              </div>
              <div className="adm-field">
                <label htmlFor="food-description">Description</label>
                <textarea
                  id="food-description"
                  className="adm-textarea"
                  placeholder="Short description of the dish"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="adm-field">
                <label htmlFor="food-price">Price (₹)</label>
                <input
                  id="food-price"
                  className="adm-input"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="adm-btn adm-btn-primary adm-btn-full" disabled={savingFood}>
                {savingFood ? 'Adding…' : 'Add Food Item'}
              </button>
            </form>
          </div>
        </div>

        {/* Review moderation */}
        <div className="adm-section-title">
          <h2>Review Moderation</h2>
          {!reviewsLoading && <span className="adm-count">{reviews.length} {reviewTab}</span>}
        </div>

        <div className="adm-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`adm-tab ${reviewTab === tab ? 'adm-tab-active' : ''}`}
              onClick={() => setReviewTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {reviewsLoading ? (
          <div>
            <div className="adm-skeleton adm-skeleton-review" />
            <div className="adm-skeleton adm-skeleton-review" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="adm-empty">No {reviewTab} reviews right now.</div>
        ) : (
          <div className="adm-review-list">
            {reviews.map((review) => (
              <div key={review._id} className="adm-review">
                <div className="adm-review-top">
                  <div>
                    <p className="adm-review-dish">{review.itemId?.name || 'Unknown item'}</p>
                    <p className="adm-review-rest">{review.restaurantId?.name || 'Unknown restaurant'}</p>
                  </div>

                  <div className="adm-user">
                    <div className="adm-avatar">{getInitials(review.userId?.name)}</div>
                    <div className="adm-user-meta">
                      <strong>{review.userId?.name || 'Unknown user'}</strong>
                      {/* {review.userId?.email || 'No email on file'} */}
                    </div>
                    {review.isAnonymous && <span className="adm-anon-badge">Anonymous</span>}
                  </div>
                </div>

                <div className="adm-chips">
                  {RATING_FIELDS.map(({ key, label }) => (
                    <span key={key} className={`adm-chip adm-chip-${ratingTone(review[key])}`}>
                      {label}: {review[key] ?? '–'}
                    </span>
                  ))}
                </div>

                <p className="adm-comment">{review.comment}</p>

                <div className="adm-actions">
                  {reviewTab !== 'approved' && (
                    <button type="button" className="adm-btn adm-btn-success" onClick={() => handleApprove(review._id)}>
                      <CheckIcon /> Approve
                    </button>
                  )}
                  {reviewTab !== 'rejected' && (
                    <button type="button" className="adm-btn adm-btn-warning" onClick={() => handleReject(review._id)}>
                      <XIcon /> Reject
                    </button>
                  )}
                  <button type="button" className="adm-btn adm-btn-danger" onClick={() => handleDelete(review._id)}>
                    <TrashIcon /> Delete permanently
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
