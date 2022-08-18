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
   * @param v
   */
  stubValue(v: any): any;
  /**
   * Throw a Standard error.
   * @param msg
   */
  error(msg: string): never;
}
