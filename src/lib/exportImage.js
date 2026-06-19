import { toPng } from 'html-to-image';

// Turn a card DOM node into a downloadable PNG. We render at 2x for a crisp
// image and read the current background color so the exported card matches the
// active theme.
export async function downloadCardImage(node, fileName = 'better-dev-advice') {
  if (!node) return;

  const background = getComputedStyle(document.body).backgroundColor;

  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: background,
    // Add a little breathing room around the card in the exported image.
    style: {
      margin: '0',
      padding: getComputedStyle(node).padding,
    },
  });

  const link = document.createElement('a');
  link.download = `${fileName}.png`;
  link.href = dataUrl;
  link.click();
}
