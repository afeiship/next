# next
> A javascript OOP toolkit for mobile.

[![version][version-image]][version-url]
[![license][license-image]][license-url]
[![size][size-image]][size-url]
[![download][download-image]][download-url]

## installation
```shell
npm install --save @jswork/next
```

## node
```js
import nx from '@jswork/next';

const MyClass = nx.declare({
  statics:{
    init: function(){
      console.log('hello next!')
    }
  }
})
```

## browser
```html
<script type="text/javascript" src="https://unpkg.com/@jswork/next"></script>
<script type="text/javascript">
(function (nx, global) {
  nx.declare('myApp', {
    statics: {
      init: function () {
        alert('hello next!');
      }
    }
  });
}(nx, nx.GLOBAL));
</script>
```

## license
Code released under [the MIT license](https://github.com/afeiship/next/blob/master/LICENSE.txt).

[version-image]: https://img.shields.io/npm/v/@jswork/next
[version-url]: https://npmjs.org/package/@jswork/next

[license-image]: https://img.shields.io/npm/l/@jswork/next
[license-url]: https://github.com/afeiship/next/blob/master/LICENSE.txt

[size-image]: https://img.shields.io/bundlephobia/minzip/@jswork/next
[size-url]: https://github.com/afeiship/next/blob/master/dist/next.min.js

[download-image]: https://img.shields.io/npm/dm/@jswork/next
[download-url]: https://www.npmjs.com/package/@jswork/next
