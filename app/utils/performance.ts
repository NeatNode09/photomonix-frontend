/**
 * Preload images to improve perceived performance
 * @param urls Array of image URLs to preload
 */
export function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to preload: ${url}`));
          img.src = url;
        })
    )
  );
}

/**
 * Check if image is in cache
 * @param url Image URL to check
 */
export function isImageCached(url: string): boolean {
  const img = new Image();
  img.src = url;
  return img.complete;
}

/**
 * Lazy load images using Intersection Observer
 * @param element Element to observe
 * @param callback Callback when element enters viewport
 */
export function lazyLoadImage(
  element: HTMLImageElement,
  callback?: () => void
): IntersectionObserver {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;

          if (src) {
            img.src = src;
            img.removeAttribute("data-src");
          }

          callback?.();
          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: "50px", // Start loading 50px before entering viewport
    }
  );

  observer.observe(element);
  return observer;
}

/**
 * Throttle function execution
 * @param func Function to throttle
 * @param limit Time limit in milliseconds
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Measure performance of a function
 * @param fn Function to measure
 * @param label Optional label for console output
 */
export async function measurePerformance<T>(
  fn: () => T | Promise<T>,
  label?: string
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();

  if (label) {
    console.log(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`);
  }

  return result;
}

/**
 * Create a cancelable promise
 * @param promise Promise to make cancelable
 */
export function makeCancelable<T>(promise: Promise<T>): {
  promise: Promise<T>;
  cancel: () => void;
} {
  let isCanceled = false;

  const wrappedPromise = new Promise<T>((resolve, reject) => {
    promise
      .then((value) => {
        if (!isCanceled) {
          resolve(value);
        }
      })
      .catch((error) => {
        if (!isCanceled) {
          reject(error);
        }
      });
  });

  return {
    promise: wrappedPromise,
    cancel: () => {
      isCanceled = true;
    },
  };
}
