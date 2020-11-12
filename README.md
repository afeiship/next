# next
> A javascript OOP toolkit for mobile.

## installation
```bash
# window.nx
npm install --save @jswork/next@1.6.5

# inner context
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
<script type="text/javascript" src="//unpkg.com/@jswork/next@1.0.0/dist/next.min.js"></script>
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
