Px.js 
===
## PC-Axis file parsing in JavaScript

Px.js is a JavaScript library for extracting and manipulating data stored in PC-Axis files. It is intended as a generic solution which can handle any well-formed PC-Axis file.

Px.js is primarily intended for use in a web browser but it can also be used as a Node.js module.

### What is PC-Axis?

PC-Axis is a file format used for dissemination of statistical information. The format is used by a large number of national
statistical organisations to disseminate official statistics. For general information on PC-Axis refer to the
[PC-Axis web site](http://www.scb.se/Pages/StandardNoLeftMeny____314045.aspx) and for information on the file format specifically, see the
[PC-Axis file format specification](http://www.scb.se/Pages/List____314011.aspx).

## Dependencies

Px.js is dependent on the [Underscore](http://underscorejs.org) JavaScript utility library.

## Getting Started

### In the browser

Download the minified [production version][min] or the [development version][max].

[min]: https://raw.github.com/fod/px.js/master/dist/px.min.js
[max]: https://raw.github.com/fod/px.js/master/dist/px.js

Include [Underscore](http://underscorejs.org) and Px.js in your HTML:

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

Use the FileReader API to pass the file to the Px constructor. For example, assuming a file input tag with the id 'pxfile' in your HTML...

```html
<input type="file" id="pxfile" />
```

...construct a new Px object in a callback triggered when a new file is selected:

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
// Constructor
var px = new Px(pxString);

// return values for passed keyword
var keyword = px.keyword('KEYWORD');

// return array containing all keywords
var keys = px.keywords();

// return array containing all variables (STUBs & HEADINGs)
var vars = px.variables();

// return variable at index 0 in variables array
var variable = px.variable(0);

// return index of Region variable in variables array 
var variable = px.variable('Region');

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

Px attributes are not intended to be accessed directly. Data and metadata are generally accessed more easily and more consistently via the object's [methods](#methods).

__metadata__

The metadata attribute is an object containing all of the PC-Axis file's metadata. Each of the metadata object's keys is a metadata keyword from the original PC-Axis file, each of its values is an object. Where a keyword in the original PC-Axis file has a single string value (meaning that the value applies to the entire dataset - e.g. the 'TITLE' keyword), then that keyword's value object contains a single key, 'TABLE', the value of which is the string to which that keyword pointed to in the original PC-Axis file.

```javascript
// Return metadata object
var meta = px.metadata;

// Return dataset's TITLE value as string
var title = px.metadata.TITLE.TABLE;

// Return object with variables as keys and arrays of codes as values
var codes = px.metadata.CODES;

// Return array of codes for Region variable
var regCodes = px.metadata.CODES.Region;
```

__data__

The data attribute is an array containing all of the values following the DATA keyword in the original PC-Axis file. The data are stored as strings. Missing or obfuscated data values (encoded usually as a series of dots ("..") or a dash ("-") in Pc-Axis files) are stored unchanged in the data object.

```javascript
// Return array of data
var data = px.data;
```

<a name="methods" />
### Methods

__keyword(String)__

The keyword method returns the value of the passed keyword. If the keyword holds a value which refers to the entire table (such as the 'TITLE' keyword), then that value is returned as a string. If the keyword passed to the method has different values for each variable (for example, the 'VALUES' and 'CODES' keywords will have a different list of values for each variable), then a reference to the object holding the entire set of values is returned by the method.

```javascript
// Return the value of the title keyword as a string
var title = px.keyword('TITLE');

// Return object with variables as keys and arrays of codes as values
var codes = px.keyword('CODES');
```

__keywords()__

The keywords method returns an array containing all of the metadata keywords associated with the PC-Axis dataset represented by the object.

```javascript
// Return an array of keywords
var metaKeys = px.keywords();
```

__title()__

The title method is a convenience method which returns the TITLE attribute of the dataset. It is equivalent to ```metadata.TABLE.TITLE```.

```javascript
// Return TITLE of dataset
var title = px.title();
```

__variables()__

The variables method returns an array containing the names of all of the variables present in the current PC-Axis file. The variables in the returned array are ordered as they are in the PC-Axis file; first the 'STUB' variables, followed by the 'HEADING' variables.

```javascript
// Return an array of variable names
var variables = px.variables();
```

__variable(String or Array-Index)__

When passed an array index the variable method returns the variable name at that index in an array composed of [STUB variables, HEADING variables] - i.e. the array returned by the variables method.

When passed a string (containing a variable name) this method returns the index in the variables array at which the named variable occurs.

```javascript
// Return the name of the variable at position 0 in the variables array
var varName = px.variable(0);

// Return the position (array index) of the 'Region' variable in the variables array
var idx = px.variable('Region');
```

__valCounts()__

Returns an array of value counts. Each element in the array is the number of possible values in the current PC-Axis dataset for the variable with the same index (in the variables array) as the element.

```javascript
// Return array of value counts
var counts = px.valCounts();
```

__values(String or Array-Index)__

When passed the name of a variable or the index of a variable in the variables array the values method returns an array containing the names of all possible values for that variable.

The order of the values in the array returned by this method matches the order in the original file.

```javascript
// Return an array of all possible values (by name) for the variable at position 0 in the variables array
var vals = px.values(0);

// Return an array of possible values (by name) for the 'Region' variable
var vals = px.values('Region');
```

__codes(String or Array-Index)__

When passed the name of a variable or the index of a variable in the variables array the codes method returns an array containing the codes for all possible values for that variable.

The order of the value codes in the array returned by this method matches the order in the original file.

```javascript
// Return an array of all possible values (by code) for the variable at position 0 in the variables array
var codes = px.codes(0);

// Return an array of possible values (by code) for the 'Region' variable
var codess = px.codes('Region');
```

__value(String, String)__

Returns the value name corresponding to the value code and variable name passed.

```javascript
// Return the value for the 'Region' variable, for which the code is '01'
var code = value('01', 'Region');
```

__code(String, String)__

Returns the code corresponding to the value name and variable name passed.

```javascript
// Return the code for the 'Region' variable named 'State'
var code = value('State', 'Region');
```

__datum(Array-of-Array-Indices)__

The ```datum``` method takes an array of value indices and returns the data value corresponding to the particular combination of values represented by those indices.

For example, consider a dataset containing two variables, each of which has two possible values:

```javascript
// Two variables
px.variables();    // ['Sex', 'Year']

// Each variable has two possible values
px.values('Sex');  // ['Male', 'Female']
px.values('Year'); // ['2011', '2012']

px.datum([0,0]);  // Data value for males in 2011
px.datum([0,1]);  // Data value for males in 2012
px.datum([1,0]);  // Data value for females in 2011
px.datum([1,1]);  // Data value for females in 2012
```

__dataCol(Array-of-Array-Indices)__

__dataDict(Array-of-Array-Indices)__

__entries()__

__truncate(Array-of-Arrays-of-Array-Indices)__

__subset(Array-of-Arrays-of-Array-Indices)__

## Extending Px.js


## Contributing

## Bugs

## Release History


## License
Copyright (c) 2012 Fiachra O'Donoghue  
Licensed under the MIT license.

