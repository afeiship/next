declare namespace Nx {
  type BREAKER = object;
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

  type MapIterator = (
    indexKey: string | number,
    value: any,
    target: any
  ) => any[];

  type DefinedMemember = 'Method' | 'Property' |'BombMethod';
}
