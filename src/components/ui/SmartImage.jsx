import { useState } from 'react';
import { ImageOff } from 'lucide-react';

function SmartImageInner({
  src,
  fallbackSrc,
  alt,
  className = '',
  imgClassName = '',
  loading = 'lazy',
  fetchPriority,
  sizes,
  onLoad,
}) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [status, setStatus] = useState('loading');

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }
    setStatus('error');
  };

  return (
    <div className={`relative overflow-hidden bg-line ${className}`}>
      {status === 'loading' && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-line via-white to-haze/60"
        />
      )}

      {status === 'error' ? (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-haze to-mist text-ink-soft"
        >
          <ImageOff className="h-6 w-6" strokeWidth={1.5} />
          <span className="text-[11px] font-medium tracking-wide uppercase">Photo unavailable</span>
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={alt}
          loading={loading}
          decoding="async"
          fetchPriority={fetchPriority}
          sizes={sizes}
          draggable={false}
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={(event) => {
            setStatus('loaded');
            onLoad?.(event);
          }}
          onError={handleError}
          className={`transition-opacity duration-700 ease-out ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      )}
    </div>
  );
}

/**
 * Image with skeleton loading state, a fallback source, and a graceful error state.
 * Remounts whenever `src` changes so state never leaks between photos.
 */
export function SmartImage(props) {
  return <SmartImageInner key={props.src} {...props} />;
}
