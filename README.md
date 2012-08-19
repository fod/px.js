Px.js 
===
## PC-Axis file parsing in JavaScript

Px.js is a JavaScript for extracting data (and metadata) from PC-Axis files.

PC-Axis is a file format used for dissemination of statistical information. The format is used by a number of national statistical organisations to disseminate official statistics.

### Why parse PC-Axis files in the browser?

Ordinarily, to display or use data held in a PC-Axis file in a web browser, it is necessary to either parse the PC-Axis file on the server and extract information based on a user's request, or to preprocess the data and store extracted subsets on the server. 

## Dependencies

[underscore.js](http://underscorejs.org)

## Getting Started

Px.js is primarily intended for use in a web browser but it can also be used as a Node.js module.


### In the browser

Download the minified [production version][min] or the [development version][max].

[min]: https://raw.github.com/fod/px.js/master/dist/px.min.js
[max]: https://raw.github.com/fod/px.js/master/dist/px.js

Include [underscore](http://underscorejs.org) and Px.js in your HTML:

```html
<script type="text/javascript" src="path/to/underscore.js"></script>
<script type="text/javascript" src="path/to/px.js"></script>
```

then in your JavaScript:

<a name="remoteFile" />
__For remote PC-Axis files:__

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

<a name="localFile" />
__For local PC-Axis files:__

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
Install the module with npm: 

`npm install pxjs`

then, in your code:

```javascript
var Px = require('pxjs'),
    fs = require('fs');
	
fs.readFile('path/to/PC-Axis/file', 'utf8', function(err, data) {
	px = new Px(data);
});
```

## Documentation

### Synopsis

```javascript
// construction
var px = new Px(pxString);

// return values for passed keyword
var title = px.keyword('TITLE');

// return array containing all keywords
var keys = px.keywords();

// return array containing all variables (STUBs & HEADINGs)
var vars = px.variables();

// return array of values for passed variable
// (can take array index or variable name)
var values = px.values(variable);

// return array of value codes for passed variable
// (can take array index or variable name)
var codes = px.codes(variable);
    
// return the data value for a passed array of variable values
var datapoint = px.datum([0,0,0,0]);

// return a column of data
var column = px.dataCol(['*',0,0,0]);

// return an associative array of data in the form: {valueName: data}
var column = px.dataDict(['*',0,0,0]);

// Return an array of data objects, one for each datum
var entries = px.entries();

// Remove values and associated data from Px object
px.truncate([[2,3,4,5],['*'],['*'],['*']]);
```

### Construction

A new PC-Axis object is constructed by passing a string containing a PC-Axis file's contents to the PX constructor. This will usually be done in the callback of a [FileReader.readAsText()](#localFile) or an [XMLHttpRequest](#remoteFile) (resultText) call, as both of these return a string containing the target file's contents.

```javascript
	var pxString; // String containing PC-Axis file's contents
	var px = new Px(pxString);
```

The Px constructor parses the PC-Axis file's data and metadata into two attributes, data and metadata, and returns an object equipped with a number of methods to access and manipulate its contents.

### Attributes

Px attributes are not intended to be accessed directly. Often it is easier to access data and metadata via the object's [methods](#methods).

__metadata__

The metadata attribute is an object containing all of the PC-Axis file's metadata. Each of the metadata object's keys is a metadata keyword from the original PC-Axis file, each of its values is an object. Where a keyword in the original PC-Axis file has a single string value (meaning that the value applies to the entire dataset - e.g. the 'TITLE' keyword), then that keyword's value object contains a single key, 'TABLE', the value of which is the string to which that keyword pointed to in the original PC-Axis file.


__data__



<a name="methods" />
### Methods

__keyword__

__keywords__

__variables__

__values__

__codes__

__datum__

__dataCol__

__dataDict__

__entries__

__truncate__

__subset__

## Extending Px.js


## Contributing


## Release History


## License
Copyright (c) 2012 Fiachra O'Donoghue  
Licensed under the MIT license.

