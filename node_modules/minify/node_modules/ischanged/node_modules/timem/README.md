TimeM
======

Get file modification time.

## Install

`npm i timem --save`

## Hot to use

```js
    var time = require('timem');
    
    time.get('/etc/passwd', function(error, time) {
        console.log(error || time);
    }
    
    time.get('/etc/passwd', function(error, 'raw', time) {
        console.log(error || time);
    }
```

## License

MIT
