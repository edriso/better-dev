import { useRef } from 'react';
import AdviceCard from './AdviceCard.jsx';
import { downloadCardImage } from '../lib/exportImage.js';
import { DownloadIcon, TrashIcon } from './icons.jsx';

function SavedItem({ item, onRemove }) {
  const cardRef = useRef(null);

  return (
    <li className="saved-item">
      <AdviceCard ref={cardRef} item={item} compact />
      <div className="saved-item__actions">
        <button
          type="button"
          className="icon-button"
          onClick={() => downloadCardImage(cardRef.current, `advice-${item.id}`)}
          aria-label="Download this advice as an image"
          title="Download as image"
        >
          <DownloadIcon />
        </button>
        <button
          type="button"
          className="icon-button"
          onClick={() => onRemove(item.id)}
          aria-label="Remove from saved"
          title="Remove"
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
}

export default function SavedView({ saved, onRemove }) {
  if (saved.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state__title">Nothing saved yet</p>
        <p className="empty-state__hint">
          Tap the heart on any advice you want to keep. It lives in this browser,
          ready whenever you come back.
        </p>
      </div>
    );
  }

  return (
    <div className="saved-view">
      <p className="saved-view__count">
        {saved.length} saved {saved.length === 1 ? 'note' : 'notes'}
      </p>
      <ul className="saved-list">
        {saved.map((item) => (
          <SavedItem key={item.id} item={item} onRemove={onRemove} />
        ))}
      </ul>
    </div>
  );
}
