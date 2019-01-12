# next-js-core2
> A javascript OOP toolkit for mobile.

## install:
```bash
npm install --save afeiship/next-js-core2
```

## use in browser:
```html
<script type="text/javascript" src="../libs/next-js-core2/dist/next-js-core2.js"></script>
<script type="text/javascript">
(function(nx, global) {
  nx.declare('myApp',{
    statics:{
      init:function(){
        alert('hello next!');
      }
    }
  });
}(nx, nx.GLOBAL));
</script>
```

## size:
+ [ default size ]: all files 16 kB
+ [ minimize size ]: all files 8 kB
+ [real size]: 5,945 bytes (8 KB on disk) -> 5,191 bytes
