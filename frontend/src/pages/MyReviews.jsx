import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const STATUS_CONFIG = {
  approved: { label: 'Approved', tone: 'good' },
  rejected: { label: 'Rejected', tone: 'bad' },
  pending: { label: 'Pending Approval', tone: 'mid' },
};

function ratingTone(score) {
  if (score >= 4) return 'good';
  if (score >= 3) return 'mid';
  return 'bad';
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

.mr-root {
  --paper: #F2EEE3;
  --surface: #FFFDF8;
  --border: #DED5BF;
  --border-strong: #C7BB9E;
  --ink: #241F19;
  --ink-muted: #746B5C;
  --accent: #C08A1E;
  --accent-dark: #8C6314;
  --success: #2F7D4F;
  --success-soft: #E1EFE3;
  --warning: #B0611E;
  --warning-soft: #F6E4D2;
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
.mr-root *, .mr-root *::before, .mr-root *::after { box-sizing: border-box; }
.mr-container { max-width: 760px; margin: 0 auto; }
.mr-header { margin-bottom: 28px; }
.mr-header h2 {
  font-family: var(--font-display); font-weight: 400; text-transform: uppercase;
  font-size: clamp(22px, 4vw, 28px); letter-spacing: 0.01em; margin: 0 0 6px;color: #000;
}
.mr-header p { font-family: var(--font-mono); font-size: 12px; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 0.05em; margin: 0; }
.mr-error {
  background: var(--danger-soft); color: var(--danger); border: 1.5px solid var(--danger);
  padding: 12px 16px; border-radius: 2px; font-size: 14px; font-weight: 600; margin-bottom: 20px;
}
.mr-empty {
  text-align: center; padding: 52px 20px; color: var(--ink-muted); font-size: 14px;
  font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.05em;
  background: var(--surface); border: 1px dashed var(--border-strong); border-radius: 3px;
}
.mr-empty a { color: var(--accent-dark); font-weight: 700; text-decoration: none; }
.mr-empty a:hover { text-decoration: underline; }
.mr-list { display: flex; flex-direction: column; gap: 18px; }
.mr-skeleton {
  height: 120px; border-radius: 3px;
  background: linear-gradient(90deg, #EDE7D8 25%, #DED5BF 37%, #EDE7D8 63%); background-size: 400% 100%;
  animation: mr-shimmer 1.4s ease infinite;
}
@keyframes mr-shimmer { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }
.mr-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: 3px;
  padding: 20px 22px 20px 30px; position: relative; box-shadow: 3px 3px 0 var(--border-strong);
}
.mr-card::before, .mr-card::after {
  content: ""; position: absolute; left: -1px; width: 13px; height: 13px; border-radius: 50%;
  background: var(--paper); border: 1px solid var(--border-strong);
}
.mr-card::before { top: 20px; }
.mr-card::after { bottom: 20px; }
.mr-card-top {
  display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;
  margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px dashed var(--border-strong); flex-wrap: wrap;
}
.mr-item-name { font-size: 16px; font-weight: 700; margin: 0 0 3px; }
.mr-restaurant { font-family: var(--font-mono); font-size: 12px; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 0.04em; margin: 0; }
.mr-date { font-family: var(--font-mono); font-size: 11px; color: var(--ink-muted); margin: 4px 0 0; }
.mr-status {
  font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 2px; font-family: var(--font-mono);
  text-transform: uppercase; letter-spacing: 0.06em; border: 1.5px solid transparent; white-space: nowrap;
}
.mr-status-good { background: var(--success-soft); color: var(--success); border-color: var(--success); }
.mr-status-mid { background: var(--warning-soft); color: var(--warning); border-color: var(--warning); }
.mr-status-bad { background: var(--danger-soft); color: var(--danger); border-color: var(--danger); }
.mr-chips { display: flex; gap: 8px; flex-wrap: wrap; margin: 0 0 14px; }
.mr-chip {
  font-size: 11px; font-weight: 700; padding: 5px 10px; border-radius: 2px; font-family: var(--font-mono);
  text-transform: uppercase; letter-spacing: 0.04em; border: 1.5px solid transparent;
}
.mr-chip-good { background: var(--success-soft); color: var(--success); border-color: var(--success); }
.mr-chip-mid { background: var(--warning-soft); color: var(--warning); border-color: var(--warning); }
.mr-chip-bad { background: var(--danger-soft); color: var(--danger); border-color: var(--danger); }
.mr-comment {
  font-size: 14px; color: var(--ink); line-height: 1.55; font-style: italic; background: var(--paper);
  border-left: 3px solid var(--accent); padding: 10px 14px; border-radius: 2px; margin: 0 0 14px;
}
.mr-view-link {
  display: inline-flex; align-items: center; font-size: 11px; font-weight: 700; color: var(--accent-dark);
  text-decoration: none; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.06em;
}
.mr-view-link:hover { text-decoration: underline; }
`;

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const { data } = await API.get('/reviews');
        setReviews(data.reviews || []);
      } catch (err) {
        setError('Failed to load your reviews.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyReviews();
  }, []);

  return (
    <div className="mr-root">
      <style>{STYLES}</style>

      <div className="mr-container">
        <div className="mr-header">
          <h2>My Reviews</h2>
          <p>Manage the reviews you've left across campus</p>
        </div>

        {error && <div className="mr-error">{error}</div>}

        {loading && (
          <div className="mr-list">
            <div className="mr-skeleton" />
            <div className="mr-skeleton" />
          </div>
        )}

        {!loading && !error && reviews.length === 0 && (
          <div className="mr-empty">
            You haven't written any reviews yet. <Link to="/">Start searching for food</Link>
          </div>
        )}

        {!loading && reviews.length > 0 && (
          <div className="mr-list">
            {reviews.map((review) => {
              const status = STATUS_CONFIG[review.status] || STATUS_CONFIG.pending;
              const restaurantId = review.itemId?.restaurantId?._id;

              return (
                <div key={review._id} className="mr-card">
                  <div className="mr-card-top">
                    <div>
                      <p className="mr-item-name">{review.itemId?.name || 'Unknown food'}</p>
                      {review.itemId?.restaurantId?.name && (
                        <p className="mr-restaurant">{review.itemId.restaurantId.name}</p>
                      )}
                      {review.createdAt && (
                        <p className="mr-date">{new Date(review.createdAt).toLocaleDateString()}</p>
                      )}
                    </div>
                    <span className={`mr-status mr-status-${status.tone}`}>{status.label}</span>
                  </div>

                  <div className="mr-chips">
                    <span className={`mr-chip mr-chip-${ratingTone(review.tasteRating)}`}>
                      Taste {review.tasteRating}/5
                    </span>
                    <span className={`mr-chip mr-chip-${ratingTone(review.priceRating)}`}>
                      Price {review.priceRating}/5
                    </span>
                    <span className={`mr-chip mr-chip-${ratingTone(review.cleanlinessRating)}`}>
                      Cleanliness {review.cleanlinessRating}/5
                    </span>
                  </div>

                  {review.comment && <p className="mr-comment">"{review.comment}"</p>}

                  {restaurantId && (
                    <Link to={`/restaurant/${restaurantId}`} className="mr-view-link">
                      View / edit at restaurant →
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReviews;