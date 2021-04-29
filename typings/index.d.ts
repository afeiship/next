interface nx {
  BREAKER: object;
  VERSION: string;
  DEBUG: boolean;
  GLOBAL: Window;
  noop: () => void;
  stubTrue: () => boolean;
  stubFalse: () => any;
  error: () => never;
  try: () => any | never;
  forEach: (
    inArray: Array<any>,
    inCallback: (index: number, value: any, array: Array<any>) => any,
    inContext: any
  ) => void;

  forIn: (
    inObject: object,
    inCallback: (key: string, value: any, object: object) => any,
    inContext: any
  ) => void;

  each: (
    inTarget: Array<any> | object,
    inCallback: (
      key: number | string,
      value: any,
      object: Array<any> | object
    ) => any,
    inContext: any
  ) => void;
}
