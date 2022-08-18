declare namespace Nx {
  type BREAKER = typeof nx.BREAKER;
  type IteratorReturnValue = Nx.BREAKER | undefined | void;

  type ArrayIterator = (
    value: any,
    index: number,
    target: any
  ) => IteratorReturnValue;

  type ObjectIterator = (
    key: string,
    value: any,
    target: any
  ) => IteratorReturnValue;
}
