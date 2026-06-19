import { useCallback, useRef, useState } from 'react';
import AdviceCard from './components/AdviceCard.jsx';
import SavedView from './components/SavedView.jsx';
import {
  DownloadIcon,
  HeartIcon,
  MoonIcon,
  RefreshIcon,
  SunIcon,
} from './components/icons.jsx';
import useTheme from './hooks/useTheme.js';
import useSavedAdvice from './hooks/useSavedAdvice.js';
import useImageDownload from './hooks/useImageDownload.js';
import { pickRandomAdvice } from './lib/pickAdvice.js';
import { adviceFileName } from './lib/filename.js';
import './App.css';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { saved, isSaved, toggleSaved, removeSaved } = useSavedAdvice();
  const { download, pending } = useImageDownload();

  // Pick the first piece of advice once, when the app loads. A page refresh
  // runs this again and lands on a fresh one.
  const [current, setCurrent] = useState(() => pickRandomAdvice());
  const [tab, setTab] = useState('daily');

  const cardRef = useRef(null);

  const nextAdvice = useCallback(() => {
    setCurrent((prev) => pickRandomAdvice(prev?.id));
  }, []);

  const handleDownload = useCallback(() => {
    if (current) {
      download(cardRef.current, adviceFileName(current));
    }
  }, [current, download]);

  const currentIsSaved = current ? isSaved(current.id) : false;

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <h1 className="app__title">better dev</h1>
          <p className="app__tagline">A little wisdom, every time you show up.</p>
        </div>
        <button
          type="button"
          className="icon-button app__theme"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </header>

      <nav className="tabs" aria-label="Views">
        <button
          type="button"
          className={`tab${tab === 'daily' ? ' tab--active' : ''}`}
          onClick={() => setTab('daily')}
          aria-current={tab === 'daily' ? 'page' : undefined}
        >
          Advice
        </button>
        <button
          type="button"
          className={`tab${tab === 'saved' ? ' tab--active' : ''}`}
          onClick={() => setTab('saved')}
          aria-current={tab === 'saved' ? 'page' : undefined}
        >
          Saved{saved.length > 0 ? ` (${saved.length})` : ''}
        </button>
      </nav>

      <main className="app__main">
        {tab === 'daily' ? (
          <section className="daily">
            {/* Announce new advice to assistive tech as the card swaps. */}
            <div aria-live="polite" aria-atomic="true">
              <AdviceCard ref={cardRef} item={current} />
            </div>

            <div className="daily__actions">
              <button
                type="button"
                className="button button--primary"
                onClick={nextAdvice}
              >
                <RefreshIcon />
                <span>New advice</span>
              </button>

              <button
                type="button"
                className={`icon-button${currentIsSaved ? ' icon-button--active' : ''}`}
                onClick={() => current && toggleSaved(current)}
                aria-pressed={currentIsSaved}
                aria-label={currentIsSaved ? 'Remove from saved' : 'Save this advice'}
                title={currentIsSaved ? 'Remove from saved' : 'Save'}
              >
                <HeartIcon filled={currentIsSaved} />
              </button>

              <button
                type="button"
                className="icon-button"
                onClick={handleDownload}
                disabled={!current || pending}
                aria-label="Download this advice as an image"
                title="Download as image"
              >
                <DownloadIcon />
              </button>
            </div>
          </section>
        ) : (
          <SavedView saved={saved} onRemove={removeSaved} />
        )}
      </main>

      <footer className="app__footer">
        <p>
          Advice gathered from books, talks and writing by the engineers credited
          on each card. Built as a small open project.
        </p>
      </footer>
    </div>
  );
}
