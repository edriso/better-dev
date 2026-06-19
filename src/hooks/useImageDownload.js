import { useCallback, useRef, useState } from 'react';
import { downloadCardImage } from '../lib/exportImage.js';

// Wraps the PNG export with a pending flag and error handling so the UI can
// disable the button while it works and recover gracefully if it fails.
export default function useImageDownload() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  // Guards against overlapping exports from rapid double clicks.
  const inFlight = useRef(false);

  const download = useCallback(async (node, fileName) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setError(false);
    try {
      await downloadCardImage(node, fileName);
    } catch (err) {
      console.error('Could not export the advice image', err);
      setError(true);
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }, []);

  return { download, pending, error };
}
