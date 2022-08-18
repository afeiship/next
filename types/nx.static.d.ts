interface NxStatic {
  /**
   * Current version of next.
   */
  VERSION: string;
  /**
   * Debug mode for next.
   */
  DEBUG: boolean;
  /**
   * A symbol for break.
   */
  BREAKER: {};
  /**
   * Stub code for void function.
   */
  noop(): void;
  /**
   * Stub code will get boolean true value.
   */
  stubTrue(): true;
  /**
   * Stub code will get boolean false value.
   */
  stubFalse(): false;
  /**
   * Pass value will get the same value.
   * @param v any value.
   */
  stubValue(v: any): any;
  /**
   * Throw a Standard error.
   * @param msg
   */
  error(msg: string): never;
  /**
   * ForEach but have break(nx.BREAK).
   * @param target The list target.
   * @param callback The iterator.
   * @param context The execute context.
   */
  forEach(target: any[], callback: Nx.ArrayIterator, context?): void;
  /**
   * ForIn for js object with break.
   * @param target The js object.
   * @param callback The iterator.
   * @param context The execute context.
   */
  forIn(target: any, callback: Nx.ObjectIterator, context?): void;

  /**
   * Each for enumerate object.
   * @param target
   * @param callback
   * @param context
   */
  each(
    target: any,
    callback: Nx.ArrayIterator | Nx.ObjectIterator,
    context?
  ): void;

  /**
   * Get mapped array.
   * @param target
   * @param callback
   * @param context
   */
  map(target: any, callback: Nx.MapIterator, context?): void;

  /**
   * Merge object.
   * @param args
   */
  mix(...args): any;
}
