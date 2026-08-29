import { useEffect, useState } from 'react';
import './Preloader.css';

interface PreloaderProps {
  onReady: () => void;
}

export function Preloader({ onReady }: PreloaderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let settled = false;

    const markReady = () => {
      if (settled) {
        return;
      }

      settled = true;
      setIsReady(true);
      onReady();
    };

    const handleInitialLoad = () => {
      requestAnimationFrame(markReady);
    };

    if (document.readyState === 'complete') {
      handleInitialLoad();
      return undefined;
    }

    window.addEventListener('load', handleInitialLoad, { once: true });

    if ('fonts' in document) {
      document.fonts.ready.then(markReady, markReady);
    }

    requestAnimationFrame(markReady);

    return () => {
      settled = true;
      window.removeEventListener('load', handleInitialLoad);
    };
  }, [onReady]);

  return (
    <div className={`preloader${isReady ? ' preloader-hidden' : ''}`} aria-live="polite" aria-busy={!isReady}>
      <div className="preloader-inner">
        <span className="preloader-brand">Daily Read</span>
        <span className="preloader-line" aria-hidden="true" />
      </div>
    </div>
  );
}
