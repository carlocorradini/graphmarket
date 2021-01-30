/**
 * Thread utility.
 */
export default class ThreadUtil {
  /**
   *  Causes the current thread to suspend execution for the specified period in milliseconds.
   *
   * @param ms - Time in milliseconds to sleep
   * @throws RangeError If 'ms' is < 0
   */
  public static async sleep(ms: number): Promise<void> {
    if (ms < 0) throw new RangeError(`'ms' must be a positive number: ${ms}`);

    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
