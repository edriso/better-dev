import { toPng } from 'html-to-image';

// Turn a card into a downloadable PNG.
//
// The on-screen daily card uses a tall fixed min-height so the action buttons
// below it never shift. That extra height looks like dead space in a saved
// image, so for the export we render a clone that fits its content, sitting in
// a padded wrapper. The wrapper gives the card a clean margin so its rounded
// corners and soft shadow are visible against the page background.
//
// Cloning the card into a plain wrapper (outside the ".daily" container) is
// what drops the min-height: the ".daily .advice-card" rule simply no longer
// matches, so the clone collapses to its natural height with no extra work.
//
// Rejects if there is no node or the conversion fails, so callers can show
// feedback instead of failing silently.
export async function downloadCardImage(node, fileName = 'better-dev-advice') {
  if (!node) {
    throw new Error('Nothing to export');
  }

  const background = getComputedStyle(document.body).backgroundColor;
  const width = Math.ceil(node.getBoundingClientRect().width);

  // Lay the wrapper out on-screen but behind the app and non-interactive, so
  // html-to-image paints it correctly. (Far off-screen offsets make it
  // rasterize blank.) It is removed again as soon as the capture finishes.
  const wrapper = document.createElement('div');
  wrapper.style.position = 'absolute';
  wrapper.style.left = '0';
  wrapper.style.top = '0';
  wrapper.style.zIndex = '-1';
  wrapper.style.pointerEvents = 'none';
  wrapper.style.display = 'inline-block';
  wrapper.style.padding = '40px';
  wrapper.style.background = background;
  wrapper.style.boxSizing = 'content-box';

  const clone = node.cloneNode(true);
  clone.style.minHeight = '0';
  clone.style.width = `${width}px`;
  clone.style.margin = '0';
  // Drop the entry animation so the clone is fully visible when captured.
  clone.style.animation = 'none';
  clone.style.opacity = '1';
  clone.style.transform = 'none';

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    const dataUrl = await toPng(wrapper, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: background,
    });

    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = dataUrl;
    link.click();
  } finally {
    document.body.removeChild(wrapper);
  }
}
