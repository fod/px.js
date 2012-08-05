px.js - PC-Axis file parsing in JavaScript
===

### Dependencies

[underscore.js](http://underscorejs.org)


### Synopsis

```javascript
// construction
var pxfile = Px.new('path/to/pcaxis/file.px');

// get values for keyword
var title = pxfile.keyword('TITLE');

// get array of keywords
var keys = pxfile.keywords();

// get array of variables (STUBs & HEADINGs)
var vars = pxfile.variables();

// get array of values for passed variable
// (can take array index, regular expression, or variable name)
var values = pxfile.values(variable);

// get array of value CODEs for passed variable
// (can take array index or variable name)
var codes = pxfile.codes(variable);
    
// get the data value for a passed array of variable values
var datapoint = pxfile.datum([0,0,0,0]);

// get a column of data
var column = pxfile.datacol(['*',0,0,0]);    
```

## Getting Started
### On the server
Install the module with: `npm install px.js`

```javascript
var Px = require('px.js');
```

### In the browser
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/fod/px.js/master/dist/px.min.js
[max]: https://raw.github.com/fod/px.js/master/dist/px.js


## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

_Also, please don't edit files in the "dist" subdirectory as they are generated via grunt. You'll find source code in the "lib" subdirectory!_

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Fiachra O'Donoghue  
Licensed under the MIT license.

