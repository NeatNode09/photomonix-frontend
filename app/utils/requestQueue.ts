/**
 * Request queue for rate limiting AI service calls
 * Ensures only one concurrent request at a time to prevent API overload
 */

interface QueuedRequest<T> {
  requestFn: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: Error) => void;
}

class RequestQueue {
  private queue: QueuedRequest<any>[] = [];
  private isProcessing: boolean = false;
  private readonly maxConcurrent: number = 1;

  /**
   * Enqueue a request function and return a promise that resolves with the result
   */
  async enqueue<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ requestFn, resolve, reject });
      this.processQueue();
    });
  }

  /**
   * Process the queue sequentially
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const { requestFn, resolve, reject } = this.queue.shift()!;

    try {
      const result = await requestFn();
      resolve(result);
    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error)));
    } finally {
      this.isProcessing = false;
      // Process next item in queue
      if (this.queue.length > 0) {
        this.processQueue();
      }
    }
  }

  /**
   * Get current queue length
   */
  getQueueLength(): number {
    return this.queue.length;
  }

  /**
   * Check if queue is currently processing
   */
  isActive(): boolean {
    return this.isProcessing;
  }

  /**
   * Clear all pending requests
   */
  clear(): void {
    this.queue.forEach(({ reject }) => {
      reject(new Error("Request queue cleared"));
    });
    this.queue = [];
  }
}

// Export singleton instance
export const requestQueue = new RequestQueue();
