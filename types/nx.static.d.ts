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
   * A symbol for nil.
   */
  NIL: {};

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
   * Create a promise with value.
   * @param v any value.
   */
  stubPromise(v?: any): Promise<any>;

  /**
   * If value is boolean, return true, else return false.
   * @param v
   */
  isBoolean(v: any): boolean;

  /**
   * If value is string, return true, else return false.
   * @param v
   */
  isString(v: any): boolean;

  /**
   * If value is number, return true, else return false.
   * NaN is not a number.
   * @param v
   */
  isNumber(v: any): boolean;

  /**
   * If value is function, return true, else return false.
   * @param v
   */
  isFunction(v: any): boolean;

  /**
   * If value is undefined OR null, return true, else return false.
   * @param v
   */
  isNil(v: any): boolean;

  /**
   * If value is array, return true, else return false.
   * @param v
   */
  isArray(v: any): boolean;

  /**
   * If value is object, return true, else return false.
   * Array  is not a object.
   * @param v
   */
  isObject(v: any): boolean;

  /**
   * If value is promise, return true, else return false.
   * @param v
   */
  isThenable(v: any): boolean;

  /**
   * Throw a Standard error.
   * @param msg
   */
  error(msg: string): never;

  /**
   * Nice try for fn.
   * @param fn
   * @param cb
   */
  try(fn: Function, cb: (err) => void): any;

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
   * Each for enumerable object.
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
  map(target: any, callback: Nx.MapIterator, context?): any[];

  /**
   * Merge object.
   * @param args
   */
  mix(...args): any;

  /**
   * Slice for any enumerable target.
   * @param target
   * @param start
   * @param end
   */
  slice<T>(target: T[], start?: number, end?: number): T[];

  /**
   * Set value by dot path(string or dot string).
   * @param target
   * @param path
   * @param value
   */
  set(target: any, path: string, value: any): any;

  /**
   * Get value by path(string or dot string).
   * @param target
   * @param path
   * @param default
   */
  get(target: any, path: string | string[], defaults?: any): any;

  /**
   * Delete by path(string or dot string), return boolean value.
   * @param target
   * @param path
   */
  del(target: any, path: string): boolean;

  /**
   * Get/set method.
   * @deprecated Will be delete in future.
   * @param target
   * @param path
   * @param value
   */
  path(target: any, path: string, value?: any): any;

  /**
   * Async await wrapper for easy error handling without try-catch.
   * @param promise
   * @example
   * const [err, res] = await to(fetch('https://api.github.com/users/github'));
   * if (err) throw err;
   * console.log(res);
   */
  to<T>(promise: Promise<T>): Promise<[any, undefined] | [undefined, T]>;

  /**
   * Create overload function.
   */
  createOverload(): Nx.OverloadResult;

  /**
   * Root class of nx.Class.
   */
  RootClass(): any;

  /**
   * Define static member for target.
   * @param target
   * @param name
   * @param meta
   * @param isStatic
   */
  defineProperty(target: any, name: string, meta: any, isStatic?: boolean): any;

  /**
   * Define method for target.
   * @param target
   * @param name
   * @param meta
   * @param isStatic
   */
  defineMethod(target: any, name: string, meta: any, isStatic?: boolean): any;

  /**
   * Define a series method from name with comma for a target.
   * @param target
   * @param name
   * @param meta
   * @param isStatic
   */
  defineBombMethod(
    target: any,
    name: string,
    meta: any,
    isStatic?: boolean
  ): any;

  /**
   * Define a member for nx.
   * @param member
   * @param target
   * @param obj
   * @param isStatic
   */
  defineMembers(
    member: Nx.DefinedMemember,
    target: any,
    obj: any,
    isStatic?: boolean
  ): any;

  /**
   * Define es5 class.
   * @param type
   * @param meta
   */
  declare(type: string, meta?): any;
}
