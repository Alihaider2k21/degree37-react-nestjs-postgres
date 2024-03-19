export class RetryUtil {
  static async retry<T>(
    action: () => Promise<T>,
    maxRetries: number,
    retryDelay: number,
    isTransientError: (error: any) => boolean
  ): Promise<T> {
    let retries = 0;

    async function doAction() {
      try {
        return await action();
      } catch (error) {
        if (retries < maxRetries && isTransientError(error)) {
          retries++;
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          return doAction();
        }
        throw new Error(
          `Max retries reached or non-transient error: ${error.message}`
        );
      }
    }

    return doAction();
  }
}
