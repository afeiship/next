declare namespace Nx {
  type BREAKER = object;
  type IteratorReturnValue = Nx.BREAKER | undefined;

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
