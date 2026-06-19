// The visual card for a single piece of advice. In React 19 a ref is just a
// regular prop, so the parent can hand it the DOM node for the image exporter.
export default function AdviceCard({ item, compact = false, ref }) {
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
        <span className="advice-card__author">{item.author}</span>
        {item.source ? (
          <cite className="advice-card__source">{item.source}</cite>
        ) : null}
      </footer>
      <span className="advice-card__brand" aria-hidden="true">
        better dev
      </span>
    </article>
  );
}
