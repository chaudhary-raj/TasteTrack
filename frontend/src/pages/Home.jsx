import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSearch, FaUtensils } from 'react-icons/fa';
import API from '../utils/api';

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 400;

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

.home-root {
  --paper: #F2EEE3;
  --surface: #FFFDF8;
  --border: #DED5BF;
  --border-strong: #C7BB9E;
  --ink: #241F19;
  --ink-muted: #746B5C;
  --accent: #C08A1E;
  --accent-dark: #8C6314;
  --accent-soft: #F7E9C4;
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
  padding: 56px 24px 90px;
  box-sizing: border-box;
}
.home-root *, .home-root *::before, .home-root *::after { box-sizing: border-box; }
.home-page { max-width: 1040px; margin: 0 auto; }

.home-hero { max-width: 620px; margin: 0 auto 64px; text-align: center;}
.home-kicker {
  font-family: var(--font-mono); font-size: 12px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.16em; color: var(--accent-dark); margin: 0 0 14px;
}
.home-title {
  font-family: var(--font-display); font-weight: 400; text-transform: uppercase;
  font-size: clamp(28px, 5vw, 40px); line-height: 1.15; letter-spacing: 0.01em; margin: 0 0 12px;color: #000;
}
.home-subtitle { font-size: 15px; color: var(--ink-muted); margin: 0 0 36px; }
.home-search-wrap { position: relative; width: 100%; }
.home-input-group {
  display: flex; align-items: center; gap: 10px; background: var(--surface);
  border: 1px solid var(--border-strong); border-radius: 3px; padding: 4px 6px 4px 18px;
  box-shadow: 3px 3px 0 var(--border-strong); transition: border-color .15s, box-shadow .15s;
}
.home-input-group:focus-within { border-color: var(--accent); box-shadow: 3px 3px 0 var(--accent); }
.home-search-icon { color: var(--ink-muted); flex-shrink: 0; font-size: 16px; }
.home-input {
  flex: 1; border: none; outline: none; background: transparent; font-size: 16px;
  font-family: var(--font-body); color: var(--ink); padding: 14px 8px; min-width: 0;
}
.home-search-btn {
  border: 1.5px solid var(--ink); background: var(--ink); color: #fff; border-radius: 2px;
  padding: 12px 22px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
  cursor: pointer; font-family: var(--font-mono); white-space: nowrap; transition: background .15s, border-color .15s;
  flex-shrink: 0;
}
.home-search-btn:hover { background: var(--accent-dark); border-color: var(--accent-dark); }
.home-suggestions {
  position: absolute; top: calc(100% + 8px); left: 0; right: 0; background: var(--surface);
  border: 1px solid var(--border-strong); border-radius: 3px; box-shadow: 3px 3px 0 var(--border-strong);
  list-style: none; margin: 0; padding: 6px 0; text-align: left; z-index: 20; max-height: 320px; overflow-y: auto;
}
.home-suggestion {
  padding: 12px 18px; cursor: pointer; font-size: 14px; color: var(--ink);
  border-bottom: 1px dashed var(--border); transition: background .1s;
}
.home-suggestion:last-child { border-bottom: none; }
.home-suggestion:hover, .home-suggestion-active { background: var(--accent-soft); }
.home-suggestion-empty, .home-suggestion-loading {
  padding: 14px 18px; font-size: 13px; color: var(--ink-muted); font-family: var(--font-mono);
  text-transform: uppercase; letter-spacing: 0.04em; text-align: center;
}

.home-section-header { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 22px; flex-wrap: wrap; }
.home-section-title {
  font-family: var(--font-display); font-weight: 400; text-transform: uppercase;
  font-size: clamp(18px, 3vw, 24px); letter-spacing: 0.01em; margin: 0;color: #000;
}
.home-section-kicker { font-family: var(--font-mono); font-size: 12px; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 0.06em; margin: 0; }

.home-rest-error {
  background: var(--danger-soft); color: var(--danger); border: 1.5px solid var(--danger);
  padding: 12px 16px; border-radius: 2px; font-size: 14px; font-weight: 600;
}
.home-rest-empty {
  text-align: center; padding: 44px 20px; color: var(--ink-muted); font-size: 13px;
  font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.05em;
  background: var(--surface); border: 1px dashed var(--border-strong); border-radius: 3px;
}
.home-rest-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
.home-rest-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: 3px; overflow: hidden;
  box-shadow: 3px 3px 0 var(--border-strong); display: flex; flex-direction: column; text-decoration: none; color: inherit;
  transition: transform .12s;
}
.home-rest-card:hover { transform: translate(-1px, -1px); }
.home-rest-image {
  width: 100%; aspect-ratio: 16 / 10; object-fit: cover; background: var(--accent-soft);
  border-bottom: 1px dashed var(--border-strong); display: block;
}
.home-rest-image-fallback {
  width: 100%; aspect-ratio: 16 / 10; background: var(--accent-soft); color: var(--accent-dark);
  display: flex; align-items: center; justify-content: center; font-size: 28px;
  border-bottom: 1px dashed var(--border-strong);
}
.home-rest-body { padding: 14px 16px 16px; flex: 1; display: flex; flex-direction: column; gap: 4px; }
.home-rest-name { font-size: 15px; font-weight: 700; margin: 0; }
.home-rest-address { font-family: var(--font-mono); font-size: 11px; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 0.03em; margin: 0; line-height: 1.4; }
.home-rest-cta {
  margin-top: auto; padding-top: 12px; font-family: var(--font-mono); font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.06em; color: var(--accent-dark);
}
.home-rest-skeleton {
  aspect-ratio: 16 / 10.6; border-radius: 3px;
  background: linear-gradient(90deg, #EDE7D8 25%, #DED5BF 37%, #EDE7D8 63%); background-size: 400% 100%;
  animation: home-shimmer 1.4s ease infinite;
}
@keyframes home-shimmer { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }

@media (max-width: 480px) {
  .home-input-group { flex-wrap: wrap; padding: 12px 14px; }
  .home-input { padding: 8px 4px; width: 100%; }
  .home-search-btn { width: 100%; margin-top: 8px; }
}
`;

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [restaurantsError, setRestaurantsError] = useState('');

  // Debounced suggestion fetch, race-condition-safe, with a minimum query length
  useEffect(() => {
    const trimmed = searchTerm.trim();

    if (trimmed.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      return undefined;
    }

    let ignore = false;
    setLoadingSuggestions(true);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const { data } = await API.get('/results/suggestions', { params: { q: trimmed } });
        if (!ignore) setSuggestions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        if (!ignore) setSuggestions([]);
      } finally {
        if (!ignore) setLoadingSuggestions(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      ignore = true;
      clearTimeout(delayDebounceFn);
    };
  }, [searchTerm]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load all restaurants for the browse grid
  useEffect(() => {
    let ignore = false;

    const fetchRestaurants = async () => {
      setRestaurantsLoading(true);
      setRestaurantsError('');
      try {
        const { data } = await API.get('/restaurants');
        if (!ignore) setRestaurants(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        if (!ignore) setRestaurantsError('Could not load restaurants right now.');
      } finally {
        if (!ignore) setRestaurantsLoading(false);
      }
    };

    fetchRestaurants();
    return () => {
      ignore = true;
    };
  }, []);

  const goToResults = (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSuggestions([]);
    navigate(`/results?q=${encodeURIComponent(trimmed)}`);
  };

  const selectSuggestion = (name) => {
    setSearchTerm(name);
    goToResults(name);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    goToResults(searchTerm);
  };

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setSuggestions([]);
    }
  };

  const showDropdown = searchTerm.trim().length >= MIN_QUERY_LENGTH;

  return (
    <div className="home-root">
      <style>{STYLES}</style>

      <div className="home-page">
        <div className="home-hero">
          <p className="home-kicker">NIT Kurukshetra Campus</p>
          <h1 className="home-title">What are you craving today?</h1>
          <p className="home-subtitle">Find the highest-rated dishes on campus.</p>

          <form onSubmit={handleSearchSubmit} role="search">
            <div className="home-search-wrap" ref={wrapperRef}>
              <div className="home-input-group">
                <FaSearch className="home-search-icon" />
                <input
                  className="home-input"
                  type="text"
                  placeholder="Search for Pizza, Burger, Noodles…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  role="combobox"
                  aria-expanded={showDropdown}
                  aria-autocomplete="list"
                  aria-controls="home-suggestion-list"
                />
                <button type="submit" className="home-search-btn">
                  Search
                </button>
              </div>

              {showDropdown && (
                <ul id="home-suggestion-list" className="home-suggestions" role="listbox">
                  {loadingSuggestions ? (
                    <li className="home-suggestion-loading">Searching…</li>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((name, index) => (
                      <li
                        key={name}
                        role="option"
                        aria-selected={index === activeIndex}
                        className={`home-suggestion ${index === activeIndex ? 'home-suggestion-active' : ''}`}
                        onMouseDown={() => selectSuggestion(name)}
                        onMouseEnter={() => setActiveIndex(index)}
                      >
                        {name}
                      </li>
                    ))
                  ) : (
                    <li className="home-suggestion-empty">No matches for "{searchTerm.trim()}"</li>
                  )}
                </ul>
              )}
            </div>
          </form>
        </div>

        <div>
          <div className="home-section-header">
            <h2 className="home-section-title">Browse Restaurants</h2>
            {!restaurantsLoading && !restaurantsError && (
              <p className="home-section-kicker">
                {restaurants.length} campus spot{restaurants.length === 1 ? '' : 's'}
              </p>
            )}
          </div>

          {restaurantsError && <div className="home-rest-error">{restaurantsError}</div>}

          {restaurantsLoading && (
            <div className="home-rest-grid">
              <div className="home-rest-skeleton" />
              <div className="home-rest-skeleton" />
              <div className="home-rest-skeleton" />
            </div>
          )}

          {!restaurantsLoading && !restaurantsError && restaurants.length === 0 && (
            <div className="home-rest-empty">No restaurants added yet. Check back soon!</div>
          )}

          {!restaurantsLoading && restaurants.length > 0 && (
            <div className="home-rest-grid">
              {restaurants.map((r) => (
                <Link key={r._id} to={`/restaurant/${r._id}`} className="home-rest-card">
                  {r.imageUrl ? (
                    <img src={r.imageUrl} alt={r.name} className="home-rest-image" />
                  ) : (
                    <div className="home-rest-image-fallback">
                      <FaUtensils />
                    </div>
                  )}
                  <div className="home-rest-body">
                    <h3 className="home-rest-name">{r.name}</h3>
                    {r.contactInfo && <p className="home-rest-address">Mob : {r.contactInfo}</p>}
                    <span className="home-rest-cta">View Menu →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;