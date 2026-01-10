import { useState, useCallback } from "react";
import { hashFile } from "../utils/imageUtils";
import type { SuggestionServiceResponse } from "~/types/photomonix";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Hook for caching AI suggestions based on image hash
 * @param ttl Time-to-live in milliseconds (default: 1 hour)
 */
export function useSuggestionsCache(ttl: number = 3600000) {
  const [cache, setCache] = useState<
    Map<string, CacheEntry<SuggestionServiceResponse>>
  >(new Map());

  const getCached = useCallback(
    async (file: File): Promise<SuggestionServiceResponse | null> => {
      const hash = await hashFile(file);
      const entry = cache.get(hash);

      if (!entry) return null;

      // Check if expired
      if (Date.now() - entry.timestamp > ttl) {
        cache.delete(hash);
        setCache(new Map(cache)); // Trigger re-render
        return null;
      }

      return entry.data;
    },
    [cache, ttl]
  );

  const setCached = useCallback(
    async (file: File, data: SuggestionServiceResponse) => {
      const hash = await hashFile(file);
      setCache((prev) => {
        const newCache = new Map(prev);
        newCache.set(hash, { data, timestamp: Date.now() });
        return newCache;
      });
    },
    []
  );

  const clearCache = useCallback(() => {
    setCache(new Map());
  }, []);

  const getCacheSize = useCallback(() => {
    return cache.size;
  }, [cache]);

  return { getCached, setCached, clearCache, getCacheSize };
}

/**
 * Hook for memoizing expensive computations with optional cache limit
 * @param computeFn The expensive computation function
 * @param maxSize Maximum cache size (default: 50)
 */
export function useComputationCache<T, R>(
  computeFn: (input: T) => R,
  maxSize: number = 50
) {
  const [cache, setCache] = useState<Map<string, R>>(new Map());

  const compute = useCallback(
    (input: T): R => {
      const key = JSON.stringify(input);
      const cached = cache.get(key);

      if (cached !== undefined) {
        return cached;
      }

      const result = computeFn(input);

      setCache((prev) => {
        const newCache = new Map(prev);

        // Implement LRU by removing oldest entry if at max size
        if (newCache.size >= maxSize) {
          const firstKey = newCache.keys().next().value;
          if (firstKey !== undefined) {
            newCache.delete(firstKey);
          }
        }

        newCache.set(key, result);
        return newCache;
      });

      return result;
    },
    [cache, computeFn, maxSize]
  );

  return compute;
}
