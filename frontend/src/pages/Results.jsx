import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../utils/api';

function ratingTone(score) {
  if (score >= 4) return 'good';
  if (score >= 3) return 'mid';
  return 'bad';
}

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

.res-root {
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
.res-root *, .res-root *::before, .res-root *::after { box-sizing: border-box; }
.res-container { max-width: 780px; margin: 0 auto; }
.res-header { margin-bottom: 28px; }
.res-header h1 {
  font-family: var(--font-display); font-weight: 400; text-transform: uppercase;
  font-size: clamp(20px, 4vw, 28px); letter-spacing: 0.01em; margin: 0 0 6px;
}
.res-kicker { font-family: var(--font-mono); font-size: 12px; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 0.08em; margin: 0; }
.res-error {
  background: var(--danger-soft); color: var(--danger); border: 1.5px solid var(--danger);
  padding: 12px 16px; border-radius: 2px; font-size: 14px; font-weight: 600; margin-bottom: 20px;
}
.res-empty {
  text-align: center; padding: 52px 20px; color: var(--ink-muted); font-size: 14px;
  font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.05em;
  background: var(--surface); border: 1px dashed var(--border-strong); border-radius: 3px;
}
.res-list { display: flex; flex-direction: column; gap: 20px; }
.res-skeleton {
  height: 140px; border-radius: 3px;
  background: linear-gradient(90deg, #EDE7D8 25%, #DED5BF 37%, #EDE7D8 63%); background-size: 400% 100%;
  animation: res-shimmer 1.4s ease infinite;
}
@keyframes res-shimmer { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }
.res-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: 3px;
  padding: 22px 24px 22px 32px; position: relative; box-shadow: 3px 3px 0 var(--border-strong);
}
.res-card::before, .res-card::after {
  content: ""; position: absolute; left: -1px; width: 13px; height: 13px; border-radius: 50%;
  background: var(--paper); border: 1px solid var(--border-strong);
}
.res-card::before { top: 22px; }
.res-card::after { bottom: 22px; }
.res-card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 12px; }
.res-restaurant { font-family: var(--font-mono); font-size: 11px; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 4px; }
.res-dish { font-size: 18px; font-weight: 700; margin: 0 0 4px; }
.res-desc { font-size: 13px; color: var(--ink-muted); margin: 0; line-height: 1.4; }
.res-price { font-family: var(--font-mono); font-size: 13px; color: var(--ink); margin: 6px 0 0; font-weight: 600; }
.res-badge {
  flex-shrink: 0; text-align: center; background: var(--ink); color: #fff; border-radius: 2px;
  padding: 8px 12px; min-width: 64px;
}
.res-badge-score { font-family: var(--font-mono); font-size: 20px; font-weight: 700; line-height: 1; }
.res-badge-label { font-family: var(--font-mono); font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; opacity: 0.75; margin-top: 3px; }
.res-badge-new { background: var(--border-strong); color: var(--ink); }
.res-chips { display: flex; gap: 8px; flex-wrap: wrap; margin: 14px 0; padding-top: 14px; border-top: 1px dashed var(--border-strong); }
.res-chip {
  font-size: 11px; font-weight: 700; padding: 5px 10px; border-radius: 2px; font-family: var(--font-mono);
  text-transform: uppercase; letter-spacing: 0.04em; border: 1.5px solid transparent;
}
.res-chip-good { background: var(--success-soft); color: var(--success); border-color: var(--success); }
.res-chip-mid { background: var(--warning-soft); color: var(--warning); border-color: var(--warning); }
.res-chip-bad { background: var(--danger-soft); color: var(--danger); border-color: var(--danger); }
.res-meta-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.res-count { font-family: var(--font-mono); font-size: 12px; color: var(--ink-muted); }
.res-actions { display: flex; gap: 8px; align-items: center; }
.res-toggle-btn {
  background: transparent; border: 1.5px solid var(--border-strong); color: var(--ink-muted);
  padding: 8px 14px; border-radius: 2px; font-size: 11px; font-weight: 700; font-family: var(--font-mono);
  text-transform: uppercase; letter-spacing: 0.06em; cursor: pointer; transition: color .15s, border-color .15s;
}
.res-toggle-btn:hover { color: var(--ink); border-color: var(--ink); }
.res-view-link {
  display: inline-flex; align-items: center; border: 1.5px solid var(--ink); background: var(--ink); color: #fff;
  padding: 8px 16px; border-radius: 2px; font-size: 11px; font-weight: 700; text-decoration: none;
  font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.06em; transition: background .15s, border-color .15s;
}
.res-view-link:hover { background: var(--accent-dark); border-color: var(--accent-dark); }
.res-reviews { margin-top: 16px; padding-top: 16px; border-top: 1px dashed var(--border-strong); display: flex; flex-direction: column; gap: 12px; }
.res-review { background: var(--paper); border: 1px solid var(--border); border-radius: 2px; padding: 12px 14px; }
.res-review-top { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.res-avatar {
  width: 26px; height: 26px; border-radius: 50%; background: var(--ink); color: var(--surface);
  display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700;
  flex-shrink: 0; font-family: var(--font-mono);
}
.res-review-name { font-size: 13px; font-weight: 600; }
.res-review-date { font-size: 11px; color: var(--ink-muted); font-family: var(--font-mono); margin-left: auto; white-space: nowrap; }
.res-review-chips { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
.res-review-chip { font-size: 10px; font-weight: 700; padding: 3px 7px; border-radius: 2px; font-family: var(--font-mono); text-transform: uppercase; }
.res-review-comment { font-size: 13px; color: var(--ink); line-height: 1.5; font-style: italic; margin: 0; }
.res-no-reviews { font-size: 13px; color: var(--ink-muted); font-family: var(--font-mono); text-align: center; padding: 8px; }
`;

const Results = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(() => new Set());

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return undefined;
    }

    let ignore = false;

    const fetchResults = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await API.get('/results', { params: { q: query } });
        if (!ignore) setResults(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!ignore) setError('Failed to fetch results. Please try again.');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchResults();
    return () => {
      ignore = true;
    };
  }, [query]);

  const toggleExpanded = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="res-root">
      <style>{STYLES}</style>

      <div className="res-container">
        <div className="res-header">
          {query ? (
            <>
              <h1>Results for "{query}"</h1>
              {!loading && !error && (
                <p className="res-kicker">
                  {results.length} {results.length === 1 ? 'dish' : 'dishes'} found
                </p>
              )}
            </>
          ) : (
            <h1>Search for a dish to see results</h1>
          )}
        </div>

        {error && <div className="res-error">{error}</div>}

        {loading && (
          <div className="res-list">
            <div className="res-skeleton" />
            <div className="res-skeleton" />
          </div>
        )}

        {!loading && !error && query && results.length === 0 && (
          <div className="res-empty">No matches found for "{query}". Try a different craving!</div>
        )}

        {!loading && results.length > 0 && (
          <div className="res-list">
            {results.map((item) => {
              const hasRatings = item.reviewCount > 0;
              const isExpanded = expanded.has(item._id);

              return (
                <div key={item._id} className="res-card">
                  <div className="res-card-top">
                    <div>
                      <p className="res-restaurant">{item.restaurantDetails?.name || 'Unknown restaurant'}</p>
                      <h3 className="res-dish">{item.name}</h3>
                      {item.description && <p className="res-desc">{item.description}</p>}
                      {item.price != null && <p className="res-price">₹{item.price}</p>}
                    </div>

                    <div className={`res-badge ${hasRatings ? '' : 'res-badge-new'}`}>
                      <div className="res-badge-score">{hasRatings ? item.overallRating.toFixed(1) : '—'}</div>
                      <div className="res-badge-label">{hasRatings ? 'Rating' : 'New'}</div>
                    </div>
                  </div>

                  {hasRatings && (
                    <div className="res-chips">
                      <span className={`res-chip res-chip-${ratingTone(item.avgTaste)}`}>
                        Taste: {item.avgTaste.toFixed(1)}
                      </span>
                      <span className={`res-chip res-chip-${ratingTone(item.avgPrice)}`}>
                        Price: {item.avgPrice.toFixed(1)}
                      </span>
                      <span className={`res-chip res-chip-${ratingTone(item.avgCleanliness)}`}>
                        Cleanliness: {item.avgCleanliness.toFixed(1)}
                      </span>
                    </div>
                  )}

                  <div className="res-meta-row">
                    <span className="res-count">
                      {hasRatings ? `${item.reviewCount} review${item.reviewCount === 1 ? '' : 's'}` : 'No ratings yet'}
                    </span>
                    <div className="res-actions">
                      {hasRatings && (
                        <button type="button" className="res-toggle-btn" onClick={() => toggleExpanded(item._id)}>
                          {isExpanded ? 'Hide reviews' : 'See reviews'}
                        </button>
                      )}
                      <Link to={`/restaurant/${item.restaurantId}`} className="res-view-link">
                        View Menu
                      </Link>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="res-reviews">
                      {item.reviews && item.reviews.length > 0 ? (
                        item.reviews.map((review) => (
                          <div key={review._id} className="res-review">
                            <div className="res-review-top">
                              <div className="res-avatar">{getInitials(review.reviewerName)}</div>
                              <span className="res-review-name">{review.reviewerName}</span>
                              {review.createdAt && (
                                <span className="res-review-date">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <div className="res-review-chips">
                              <span className={`res-review-chip res-chip-${ratingTone(review.tasteRating)}`}>
                                Taste {review.tasteRating}
                              </span>
                              <span className={`res-review-chip res-chip-${ratingTone(review.priceRating)}`}>
                                Price {review.priceRating}
                              </span>
                              <span className={`res-review-chip res-chip-${ratingTone(review.cleanlinessRating)}`}>
                                Clean {review.cleanlinessRating}
                              </span>
                            </div>
                            {review.comment && <p className="res-review-comment">"{review.comment}"</p>}
                          </div>
                        ))
                      ) : (
                        <p className="res-no-reviews">No written reviews yet.</p>
                      )}
                    </div>
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

export default Results;