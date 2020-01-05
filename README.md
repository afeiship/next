# next-js-core2
> A javascript OOP toolkit for mobile.

## installation
```bash
# window.nx
npm install --save @feizheng/next-js-core2@1.6.5

# inner context
npm install --save @feizheng/next-js-core2
```

## node
```js
import nx from '@feizheng/next-js-core2';

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
<script type="text/javascript" src="//unpkg.com/@feizheng/next-js-core2@2.0.5/dist/next-js-core2.min.js"></script>
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
