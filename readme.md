px.js - PC-Axis file parsing in JavaScript
===

### Dependencies

[underscore.js](underscorejs.org)


### Synopsis

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
    my datapoint = pxfile.datum([0,0,0,0]);

    // get a column of data
    my column = pxfile.datacol(['*',0,0,0]);    



