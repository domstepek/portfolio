'use client';

import { useEffect } from 'react';
import type { ResolvedScreenshot } from '@/data/domains/domain-view-model';

interface ScreenshotGalleryProps {
  screenshots: ResolvedScreenshot[];
}

/**
 * ScreenshotGallery — client component rendering the screenshot carousel.
 *
 * Markup mirrors ScreenshotGallery.astro exactly so that initGalleries()
 * (which queries data-* attributes) works without changes.
 *
 * Observability:
 *   - data-screenshot-gallery on <figure> — presence selector
 *   - data-gallery-init set by initGalleries() after JS initialisation
 *   - Failure: no data-gallery-init → arrows/dots non-functional but images visible
 */
export function ScreenshotGallery({ screenshots }: ScreenshotGalleryProps) {
  useEffect(() => {
    import('./screenshot-gallery-init').then(({ initGalleries }) => {
      initGalleries();
    });
  }, []);

  if (screenshots.length === 0) return null;

  return (
    <figure className="screenshot-gallery" data-screenshot-gallery>
      <div className="screenshot-gallery__viewport" data-gallery-viewport>
        <ul className="screenshot-gallery__track" data-gallery-track>
          {screenshots.map((shot, i) => (
            <li key={i} className="screenshot-gallery__slide">
              <button
                className="screenshot-gallery__trigger"
                type="button"
                data-gallery-trigger
                data-full-src={shot.src}
                data-full-alt={shot.alt}
                data-caption={shot.caption || shot.alt}
              >
                <img
                  className="screenshot-gallery__image"
                  src={shot.src}
                  alt={shot.alt}
                  loading="lazy"
                  decoding="async"
                />
              </button>
              {shot.caption && (
                <span className="screenshot-gallery__slide-caption">{shot.caption}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <nav
        className="screenshot-gallery__nav"
        data-gallery-nav
        aria-label="Screenshot navigation"
      >
        <button
          className="screenshot-gallery__arrow screenshot-gallery__arrow--prev"
          type="button"
          data-gallery-prev
          aria-label="Previous screenshots"
          disabled
        >
          ←
        </button>
        <div className="screenshot-gallery__dots" data-gallery-dots />
        <button
          className="screenshot-gallery__arrow screenshot-gallery__arrow--next"
          type="button"
          data-gallery-next
          aria-label="Next screenshots"
        >
          →
        </button>
      </nav>

      <dialog className="screenshot-gallery__lightbox" data-gallery-lightbox>
        <button
          className="screenshot-gallery__lightbox-close"
          type="button"
          data-gallery-lightbox-close
          aria-label="Close lightbox"
        >
          ×
        </button>
        <img
          className="screenshot-gallery__lightbox-image"
          data-gallery-lightbox-img
          src=""
          alt=""
        />
        <p
          className="screenshot-gallery__lightbox-caption"
          data-gallery-lightbox-caption
        />
      </dialog>
    </figure>
  );
}
