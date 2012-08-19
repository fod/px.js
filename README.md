Px.js - PC-Axis file parsing in JavaScript
===

Px.js is a JavaScript for extracting data (and metadata) from PC-Axis files.

PC-Axis is a file format used for dissemination of statistical information. The format is used by a number of national statistical organisations to disseminate official statistics.

### Why?



## Dependencies

[underscore.js](http://underscorejs.org)

## Getting Started

Px.js is primarily intended for use in a web browser but it can also be used as a Node.js module.


### In the browser

Include [underscore](http://underscorejs.org) and Px.js in your HTML:

```html
<script type="text/javascript" src="path/to/underscore.js"></script>
<script type="text/javascript" src="path/to/px.js"></script>
```

then in your JavaScript:

_For remote PC-Axis files_

Pass the Px constructor the responseText from an XMLHttpRequest, for example: 


```javascript
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
	if (xhr.readyState === 4 && xhr.status === 200) {
		var px = new Px(xhr.responseText);
	}
};

xhr.open('GET', 'path/to/remote/PC-Axis/file');
xhr.send();
```

_For local PC-Axis files_

Use the FileReader API to pass the file to the Px constructor. For example, assuming a file input tag with the id 'pxfile' in your HTML:

```html
<input type="file" id="pxfile" />
```

construct a new Px object in a callback triggered when a new file is selected:

```javascript
document.getElementById('pxfile').onchange = handlePxfile;

var px = {};
function handlePxfile() {
	var reader = new FileReader();

    reader.onload = function() {
		return px = new Px(reader.result);
	};
	reader.readAsText(this.files[0]);
}
```

### On the server
Install the module with: 

`npm install pxjs`

then, in your code:

```javascript
var Px = require('pxjs');
```


### Synopsis

```javascript
// construction
var px = new Px();

// get values for keyword
var title = px.keyword('TITLE');

// get array of keywords
var keys = px.keywords();

// get array of variables (STUBs & HEADINGs)
var vars = px.variables();

// get array of values for passed variable
// (can take array index, regular expression, or variable name)
var values = px.values(variable);

// get array of value CODEs for passed variable
// (can take array index or variable name)
var codes = px.codes(variable);
    
// get the data value for a passed array of variable values
var datapoint = px.datum([0,0,0,0]);

// get a column of data
var column = px.dataCol(['*',0,0,0]);

// get an associative array of {value name: data}
var column = px.dataDict(['*',0'0'0]);

// 
var entries = px.entries();

//
px.truncate([[2,3,4,5],['*'],['*'],['*']]);
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

