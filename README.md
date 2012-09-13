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

`npm install px`

then, in your code:

```javascript
var Px = require('px'),
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

A new PC-Axis object is constructed by passing a string containing a PC-Axis file's contents to the `Px` constructor. This will usually be done in the callback of a `FileReader.readAsText()` or an `XMLHttpRequest` (`resultText`) call, as both of these return a string containing the target file's contents.

```javascript
var pxString; // String containing PC-Axis file's contents
var px = new Px(pxString);
```

The Px constructor parses the PC-Axis file's data and metadata into two attributes, data and metadata, and returns an object equipped with a number of methods to access and manipulate its contents.

### Attributes

Px attributes are not intended to be accessed directly. Data and metadata are generally accessed more easily and more consistently via the object's methods.

__metadata__

The `metadata` attribute is an object containing all of the PC-Axis file's metadata. Each of the metadata object's keys is a metadata keyword from the original PC-Axis file, each of its values is an object. Where a keyword in the original PC-Axis file has a single string value (meaning that the value applies to the entire dataset - e.g. the 'TITLE' keyword), then that keyword's value object contains a single key, 'TABLE', the value of which is the string to which that keyword pointed in the original PC-Axis file.

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

The `data` attribute is an array containing all of the values following the DATA keyword in the original PC-Axis file. The data are stored as strings. Missing or obfuscated data values (encoded usually as a series of dots ("..") or a dash ("-") in Pc-Axis files) are stored unchanged in the data object.

```javascript
// Return array of data
var data = px.data;
```

### Methods

__keyword(String)__

The `keyword` method returns the _value_ of the passed _keyword_. If the _keyword_ holds a value which refers to the entire table (such as the 'TITLE' keyword), then that value is returned as a string. If the keyword passed to the method has different values for each variable (for example, the 'VALUES' and 'CODES' keywords will have a different list of values for each variable), then a reference to the object holding the entire set of values is returned by the method.

```javascript
// Return the value of the title keyword as a string
var title = px.keyword('TITLE');

// Return object with variables as keys and arrays of codes as values
var codes = px.keyword('CODES');
```

__keywords()__

The `keywords` method returns an array containing all of the metadata _keywords_ associated with the PC-Axis dataset represented by the object.

```javascript
// Return an array of keywords
var metaKeys = px.keywords();
```

__title()__

The `title` method is a convenience method which returns the TITLE attribute of the dataset. It is equivalent to `metadata.TABLE.TITLE`.

```javascript
// Return TITLE of dataset
var title = px.title();
```

__variables()__

The `variables` method returns an array containing the names of all of the _variables_ present in the current PC-Axis file. The _variables_ in the returned array are ordered as they are in the PC-Axis file; first the STUB _variables_, followed by the HEADING _variables_.

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

The ```datum``` method takes an array of value indices and returns the data value corresponding to the particular combination of values represented by those indices. The number of elements in the passed array must be equal to the number of variables in the current PC-Axis dataset. Each element must be a positive integer no greater than the number of possible values for the variable it represents.  

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

The ```dataCol``` method is similar to the datum method except that one of the elements in the passed array is replaced with a ```'*'``` character and rather than returning a single datum it returns an array of data containing a datum for each possible value for the variable represented by the ```'*'```.

For example, consider a dataset containing two variables, each of which has two possible values:

```javascript
// Two variables 
px.variables();       // ['Sex', 'Year'] 

// Each variable has two possible values 
px.values('Sex');     // ['Male', 'Female'] 
px.values('Year');    // ['2011', '2012'] 

px.dataCol(['*',0]);  // [Data value for males in 2011, Data value for females in 2011] 
px.dataCol(['*',1]);  // [Data value for males in 2012, Data value for females in 2012]
px.dataCol([0,'*']);  // [Data value for males in 2011, Data value for males in 2012]
px.dataCol([1,'*']);  // [Data value for females in 2011, Data value for females in 2012]
```

__dataDict(Array-of-Array-Indices)__

The ```dataDict``` method takes and array of _value_ indices, one of which is replaced with a ```'*'``` and returns an object, the keys of which are all of the possible _values_ for the variable represented by the ```'*'```, and the values are the data values associated with the key _value_ and the particular combination of other _value_ indices in the passed array.

For example, consider a dataset containing two variables, each of which has two possible values:

```javascript
// Two variables 
px.variables();       // ['Sex', 'Year'] 

// Each variable has two possible values 
px.values('Sex');     // ['Male', 'Female'] 
px.values('Year');    // ['2011', '2012'] 

px.dataDict(['*',0]); // { 'Male': Data value for males in 2011, 
                      //   'Female': Data value for females in 2011 }
					   
px.dataDict(['*',1]); // { 'Male': Data value for males in 2012, 
                      //   'Female': Data value for females in 2012 }

px.dataDict([0,'*']); // { '2011': Data value for males in 2011, 
                      //   '2012': Data value for males in 2012 }

px.dataDict([1,'*']); // { '2011': Data value for females in 2011, 
                      //   '2012': Data value for females in 2012 }
```

__entries()__

The ```entries``` method takes no arguments and returns an array of objects containing one object for each datum in the dataset. Each object contains a key for each variable in the dataset, as well as a value for that key, and an additional key, "num", the value of which is the data value associated with that particular combination of variable values.

For example, consider a dataset containing two variables, each of which has two possible values:

```javascript
// Two variables 
px.variables();       // ['Sex', 'Year'] 

// Each variable has two possible values 
px.values('Sex');     // ['Male', 'Female'] 
px.values('Year');    // ['2011', '2012'] 

px.entries(); // [ 
              //   { 'Sex': 'Male', 'Year': '2011', 'num': Data value for males in 2011 },
              //   { 'Sex': 'Male', 'Year': '2012', 'num': Data value for males in 2012 },
			  //   { 'Sex': 'Female', 'Year': '2011', 'num': Data value for females in 2011 },
			  //   { 'Sex': 'Female', 'Year': '2012', 'num': Data value for females in 2012 }
			  // ]
```

__truncate(Array-of-Arrays-of-Array-Indices)__

The `truncate` method removes values and associated data from the Px object. The method takes an array of arrays. Each nested array consists of a list of indices of the values to be kept for the variable represented by that array. A `'*'` in any variable's array indicates that all of that variable's values should be retained. This method alters the current Px object and returns nothing. Its intended use is to allow a very large dataset, only some of which is required, to be reduced to a more manageable size.

For example, consider a dataset containing three variables, each of which has three possible values:

```javascript
// Three variables 
px.variables();         // ['Sex', 'Year', 'Age Group'] 

// Each variable has three possible values 
px.values('Sex');       // ['Male', 'Female', 'Both Sexes'] 
px.values('Year');      // ['2010', '2011', '2012']
px.values('Age Group'); // ['<16', '17-64', '65+']

// Retain 'Sex': 'Male', 'Female'; 'Year': '2012'; All Age Groups
px.truncate([[0,1],[2],['*']]);

// OR

// Retain 'Sex': 'Both Sexes'; All Years; 'Age Group': '<16', '65+'
px.truncate([[2],['*'],[0,2]]);

```

## Extending Px.js

Px.js can be easily extended to include methods and attributes for handling special tasks or for dealing with the peculiarities of PC-Axis files from some specific source. For an example of a Px.js extension designed to detect, identify and decode Irish ([CSO](http://www.cso.ie/)) PC-Axis datasets which have a geographical dimension see [px-geog-ie.js](https://github.com/fod/px-geog-ie.js/blob/master/px-geog-ie.js).

To extend Px.js, simply add methods or attributes to `Px.prototype`. The best way to do this is probably to define an immediately invoked function expression (IIFE) in your extension's JS file and to have that function add your new methods and attributes to the Px prototype within that IIFE. The extension JS file can then be included in your html _after_ Px.js has been included:

```html
<script type="text/javascript" src="path/to/underscore.js"></script>
<script type="text/javascript" src="path/to/px.js"></script>
<script type="text/javascript" src="path/to/px-extension.js"></script>
```

The `px-extension.js` file might look like this:

```javascript
(function() {
    var px = Px.prototype;
	
	px.someMethod = function() {
		...
	};
	
	px.someAttribute = {...};
	
}());

```

In Node simply `require()` your extension after the `px` library.

## Contributing

Bug fixes and enhancements are welcome. You'll need [grunt](https://github.com/cowboy/grunt) to build the project, and [nodeunit](https://github.com/caolan/nodeunit) to run the test suite. The built files in the `/dist` directory are generated by grunt on build and shouldn't be edited - the development file is `/lib/px.js`. In addition to the nodeunit test suite the `use-test` directory contains `use-test.html` which allows you to browse to a PC-Axis file and parse it so that you can play about (or manually test) the library in your browser's development console. A similar use-test file, but for Node, `node-use-test.js`, can also be found in the `/test/use-test/` directory. 

## Bugs & Feature Requests

Bugs and feature requests can be submitted to the project [issue tracker](https://github.com/fod/px.js/issues). Please link to the PC-Axis file which caused the problem if applicable, including its provenance as it is likely to be included in the test suite. A failing test would be nice too.

## License

Copyright (c) 2012 Fiachra O'Donoghue  
Licensed under the MIT license.

