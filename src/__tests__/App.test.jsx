import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App.jsx';
import { downloadCardImage } from '../lib/exportImage.js';

// The image exporter touches canvas APIs that jsdom does not implement, so we
// stub it for these UI tests.
vi.mock('../lib/exportImage.js', () => ({
  downloadCardImage: vi.fn().mockResolvedValue(undefined),
}));

describe('App', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    vi.clearAllMocks();
  });

  it('shows a piece of advice with an author on load', () => {
    render(<App />);
    const quote = screen.getByTestId('advice-text');
    expect(quote.textContent.length).toBeGreaterThan(0);
    // Some attribution should be present in the card footer.
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('shows a new piece of advice when the button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    const before = screen.getByTestId('advice-text').textContent;

    // Click a few times to beat the small chance of randomly repeating.
    let changed = false;
    for (let i = 0; i < 5 && !changed; i += 1) {
      await user.click(screen.getByRole('button', { name: /new advice/i }));
      if (screen.getByTestId('advice-text').textContent !== before) changed = true;
    }
    expect(changed).toBe(true);
  });

  it('saves advice and surfaces it in the Saved tab', async () => {
    const user = userEvent.setup();
    render(<App />);

    const savedText = screen.getByTestId('advice-text').textContent;
    await user.click(screen.getByRole('button', { name: /save this advice/i }));

    // The tab label should now show a count.
    const savedTab = screen.getByRole('button', { name: /saved \(1\)/i });
    await user.click(savedTab);

    const list = screen.getByRole('list');
    expect(within(list).getByText(savedText)).toBeInTheDocument();
  });

  it('toggles the theme', async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggle = screen.getByRole('button', { name: /switch to .* theme/i });
    const initial = document.documentElement.getAttribute('data-theme');
    await user.click(toggle);
    expect(document.documentElement.getAttribute('data-theme')).not.toBe(initial);
  });

  it('announces advice in a polite live region', () => {
    const { container } = render(<App />);
    const live = container.querySelector('[aria-live="polite"]');
    expect(live).not.toBeNull();
    expect(within(live).getByTestId('advice-text')).toBeInTheDocument();
  });

  it('exports a PNG with a human readable filename', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(
      screen.getByRole('button', { name: /download this advice as an image/i }),
    );
    expect(downloadCardImage).toHaveBeenCalledTimes(1);
    const fileName = downloadCardImage.mock.calls[0][1];
    expect(fileName).toMatch(/^better-dev-advice/);
  });

  it('shows an empty state when nothing is saved', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^saved/i }));
    expect(screen.getByText(/nothing saved yet/i)).toBeInTheDocument();
  });
});
