(function() {
    'use strict';

    var root = this;

    var Px = (function () {

        function Px(pxString) {
            this._ctor(pxString);
        }

        function _arrayOfZeroes(l) {
            var a = [];
            while (l--) {
                a[l] = 0;
            }
            return a;
        }

        Px.prototype = {
            
            keyword: function(k) {
                if (! _.include(this.keywords(), k)) {
                    throw ('\'' + k + '\' is not a valid KEYWORD');
                }

                if (this.metadata[k].TABLE) {
                    return this.metadata[k].TABLE;
                }
                else {
                    return this.metadata[k];
                }
            },

            title: function() {
                return this.keyword('TITLE');
            },

            keywords: function() {
                return _.keys(this.metadata);
            },

            variables: function() {
                return _.flatten([this.keyword('STUB'), this.keyword('HEADING')]);
            },

            variable: function(v) {
                var vars = this.variables();
                if (typeof(v) === 'number') {
                    return vars[v];
                }
                else if (typeof(v) === 'string') {
                    return _.indexOf(vars, v);
                }
                else {
                    return undefined;
                }
            },

            values: function(v) {
                var varName = 
                    typeof(v) === 'number' 
                    ? this.variable(v) 
                    : this.variables()[this.variable(v)];

                return this.keyword('VALUES')[varName];
            },

            codes: function(v) {
                var varName = 
                    typeof(v) === 'number' 
                    ? this.variable(v) 
                    : this.variables()[this.variable(v)];

                if (!this.metadata.CODES || !this.keyword('CODES')[varName]) {
                    return this.keyword('VALUES')[varName];
                }
                else {
                    return this.keyword('CODES')[varName];
                }
            },

            valCounts: function() {
                var counts = [];
                _.each(this.variables(), function(e,i) { counts.push(_.size(this.values(i))); }, this);
                return counts;
            },

            value: function(code, variable) {
                var idx = _.indexOf(this.codes(variable), code);
                return this.values(variable)[idx];
            },

            code: function(val, variable) {
                var idx = _.indexOf(this.values(variable), val);
                return this.codes(variable)[idx];
            },

            datum: function(s) {
                // TODO: check for correct array length
		// TODO: check that each index is in range
                var counts = this.valCounts();

                var index = 0;
                for (var i = 0, len = s.length - 1; i < len; i++) {
                    index += s[i] * ( _.reduce( counts.slice(i+1), function(a, b) { return a * b; }) );
                }
                index += _.last(s);
                
                // if true is passed as 2nd arg index rather than value is returned
                if (arguments[1] === true) {
                    return index;
                }
                else {
                    return this.data[index].replace(/"|'/g, '');
                }
            },

            dataCol: function(s) {
                // TODO: check for correct array length (s) and check for 1 and only 1 wildcard
                var counts = this.valCounts();

                var dataCol = [];
                var grpIdx = _.indexOf(s, '*');
		var a = s.slice(0); //copy array so function doesn't alter it

                for (var i = 0; i < counts[grpIdx]; i++) {
                    a[grpIdx] = i;
                    
                    // if true is passed as 2nd arg indices rather than values are returned
                    dataCol.push(this.datum(a, arguments[1]));
                }
                return dataCol;
            },

            dataDict: function(s) {
                // TODO allow code or val to be dict keys via optional 2nd arg
                var datadict = {},
                    grpIdx = _.indexOf(s, '*'),
                    codes = this.codes(grpIdx),
                    dataCol = this.dataCol(s);

                _.each(dataCol, function(d, i) {
                    datadict[codes[i]] = d;
                });

                return datadict;
            },
            

            datatable: function(s) {
                // This is fairly useless remove 2-dimension limit

                // TODO: check for correct array length (s) and check for 2 and only 2 wildcard
                // ALSO: allow either wildcard be the grouping variable (the STUB)
                var counts = this.valCounts();
                
                var grpIdxs = [];
                _.each(s, function(el, i) {
                    if (el === '*') {
                        grpIdxs.push(i);
                    }
                });

                var grpIdx = grpIdxs[0];
                var chgIdx = _.last(grpIdxs);

                var datatable = [];

                for (var i = 0; i < counts[chgIdx]; i++) {
                    s[grpIdx] = '*';
                    s[chgIdx] = i;
                    datatable.push(this.dataCol(s, arguments[1]));
                }
                return datatable;
            },

            entries: function() {
                // TODO -- check for data array size and if too big either (a) split the job, 
		//     (b) throw an exception and suggest a truncate or subset operation first
		
		// TODO -- allow keys to be code or values via optional argument
                var counts = this.valCounts(),
                vars = this.variables(),
                valIdx = _arrayOfZeroes(counts.length),
                last = valIdx.length - 1,
                multipliers = [],
                dataset = [];

                for (var i = 0, l = counts.length; i < l - 1; i++) {
                    // the multiplier for each variable is the product of the numbers of values 
                    // for each variable occuring after it in the variables array
                    multipliers[i] = _.reduce(counts.slice(i+1), function(a, b) { return a * b; });
                }

                _.each(this.data, function(d, i) {

                    // create datum object and push onto dataset
                    var datum = {num: d};
                    for (var di = 0, dl = vars.length; di < dl; di++) {
                        datum[vars[di]] = this.values(di)[valIdx[di]];
                    }
                    dataset.push(datum);

                    // increment indices:
                    for (var mi = 0, ml = multipliers.length; mi < ml; mi++) { 
                        if ( (i + 1) % (multipliers[mi]) === 0 ) {
                            valIdx[mi] = valIdx[mi] === counts[mi] - 1 ? 0 : valIdx[mi] + 1;
                        }
                    }
                    valIdx[last] = valIdx[last] === counts[last] - 1 ? 0 : valIdx[last] + 1;

                }, this);

                return dataset;
            },

            // remove values and associated data from this object
            truncate: function(s) {
                //TODO: validate array length
		//TODO: return unwanted subset as new Px object

                var counts = this.valCounts(),
                multipliers = [];

                _.each(s, function(d, i) {
                    if (d[0] === '*') {
                        s[i] = _.range(0, counts[i] - 1);
                    }
                });

                for (var i = 0, l = counts.length; i < l - 1; i++) {
                    multipliers[i] = _.reduce(counts.slice(i+1), function(a, b) { return a * b; });
                }
                multipliers.push(1);

                for (var j = 0, k = s.length; j < k; j++) {
                    
                    // drop the values
                    this.metadata.VALUES[this.variables()[j]] = 
                        _.filter(this.metadata.VALUES[this.variables()[j]], function(e, m) {
                            return _.indexOf(s[j], m) !== -1;
                        });
                }

                var keepIdxs = [];
                var pattern = function pattern(c,m,w,p) {
                    if (c.length > 1) {
                        p = typeof p !== 'undefined' ? p : 1;
                        var count = c.pop(),
                            multiple = m.pop(),
                            want = w.pop();

                        var patt = _.flatten(_.map(_.range(0, count), function(d) { 
                            return _.include(want, d) ? p : _arrayOfZeroes(multiple);
                        }));

                        pattern(c, m, w, patt);
                    }
                    keepIdxs.push(_.flatten(p));
                };
                pattern(counts,multipliers,s);
                keepIdxs = keepIdxs[0];

                var indices = [];
                _.each(s[0], function(d) {
                    var start = d * multipliers[0];
                    var end = start + multipliers[0];
                    indices.push(_.filter(_.range(start, end), function(d, i) {return keepIdxs[i] === 1;}));
                });
                indices = _.flatten(indices);
                this.data = _.filter(this.data, function(d, i) {return _.indexOf(indices, i) !== -1;});
            },

            // create a new object from a subset of values in this object
            subset: function(s) {
                // TODO
            },
            
            _ctor: function(pxString) {
                
                var metadata = {};
                var data;

                var pxSplit = pxString.split(/\nDATA=/);

                var pxMetadata = 
                    pxSplit[0]
                    .replace(/;\s*(\r\n?|\n)/g, ';;')
                    .replace(/;;$/, ';')
                    .replace(/(\r\n?|\n)/g, '')
                    .replace(/""/g, ' ')
                    .split(';;');

                var pxData = pxSplit[1];

                // parse metadata
                for (var i = 0, pxLen = pxMetadata.length; i < pxLen; i++) {

                    var keyOptVal = 
                        pxMetadata[i]
                        .match(/^(.+?)(?:\((.+?)\))?=(.+)$/);

                    if (!keyOptVal[2]) {
                        keyOptVal[2] = 'TABLE';
                    }

                    var key = keyOptVal[1];
                    var vals = keyOptVal[3].replace(/^"|"$/g, '').split(/","/g);
                    var opt = keyOptVal[2].replace(/"/g, '');

                    if (!metadata[key]) {
                        metadata[key] = {};
                    }

                    if (key !== 'VALUES') { // ensure that a single VALUES option still gets assigned to an array
                        metadata[key][opt] = vals.length === 1 ? vals[0] : vals;
                    }
                    else {
                        metadata[key][opt] = vals;
                    }

                }

                // parse data
                data = 
                    pxData
                    .replace(/(\r\n|\r|\n)/g, '')
                    .replace(/;\s*/, '')
                    .split(/\s+/);

                // Fix for bad files with no HEADING
                if (!metadata.HEADING) {
                    metadata.HEADING = {TABLE: []};
                }

                // Assign instance data
                this.metadata = metadata;
                this.data = data;
            }
            
        };

        return Px;

    }());

    var _ = root._;
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Px;
        }
        exports.Px = Px;
        _ = require('underscore');
    } else {
        root.Px = Px;
    }

}.call(this));

