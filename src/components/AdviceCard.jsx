import { forwardRef } from 'react';

// The visual card for a single piece of advice. It is wrapped in forwardRef so
// the parent can hand its DOM node to the image exporter.
const AdviceCard = forwardRef(function AdviceCard({ item, compact = false }, ref) {
  if (!item) return null;

  return (
    <article
      ref={ref}
      className={`advice-card${compact ? ' advice-card--compact' : ''}`}
    >
      <span className="advice-card__mark" aria-hidden="true">
        &ldquo;
      </span>
      <blockquote className="advice-card__text" data-testid="advice-text">
        {item.text}
      </blockquote>
      <footer className="advice-card__meta">
        <cite className="advice-card__author">{item.author}</cite>
        {item.source ? (
          <span className="advice-card__source">{item.source}</span>
        ) : null}
      </footer>
      <span className="advice-card__brand" aria-hidden="true">
        better dev
      </span>
    </article>
  );
});

export default AdviceCard;
