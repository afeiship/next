declare const nx: {
  /**
   * A empty stub function.
   */
  noop: () => void;
  /**
   * A truthy stub function.
   */
  stubTrue: () => true;
  /**
   * A falthy stub function.
   */
  stubFalthy: () => false;
  /**
   * An any stub value function.
   */
  stubValue: () => false;
  /**
   * Quick throw an error.
   */
  error: (msg: string) => Error;
  /**
   * Nice try.
   */
  try: (fn: Function) => void;
  /**
   * Array/list/array-like each function.
   */
  forEach: (array: any[], fn: Function, ctx: any) => void;
  /**
   * Object each function.
   */
  forIn: (array: any[], fn: Function, ctx: any) => void;
  /**
   * List or Object each function.
   */
  each: (target: any[], fn: Function, ctx: any) => void;
  /**
   * @deprecated
   * Will deprecated in next version.
   */
  map: (target: any[], fn: Function, ctx: any) => any;
};

export default nx;
