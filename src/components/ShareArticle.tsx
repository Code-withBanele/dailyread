import { useEffect, useRef, useState } from 'react';
import './ShareArticle.css';

interface ShareArticleProps {
  title: string;
  text: string;
}

export function ShareArticle({ title, text }: ShareArticleProps) {
  const [message, setMessage] = useState('');
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  function showMessage(nextMessage: string) {
    setMessage(nextMessage);
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setMessage(''), 2500);
  }

  async function copyLink(url: string) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return;
    }

    const input = document.createElement('textarea');
    input.value = url;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();
  }

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
      }
    }

    try {
      await copyLink(url);
      showMessage('Link copied');
    } catch {
      showMessage('Unable to copy link');
    }
  }

  return (
    <div className="article-share">
      <button type="button" className="article-share-button" onClick={handleShare}>
        Share article
      </button>
      <span className="article-share-message" aria-live="polite">
        {message}
      </span>
    </div>
  );
}
