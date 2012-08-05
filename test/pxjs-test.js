$.get('qunit/VSA31.px', function(data) {
    window.px = new Px(data);
});

test('Instantiation', function() {
    expect(2);
    ok(px, 'px exists');
    equal(typeof(px), 'object', 'px is an object'); 
});

test('Metadata', function() {
    expect(3);
    ok(px.title(), 'Px object has title');
    equal(px.title(), 'Period Life Expectancy (Years) by Region, Year, Sex and Age', 'Title is correct');
    equal(_.size(px.metadata), 24, 'Correct number of metadata entries');
});

test('Data', function() {
    expect(1);
    equal(_.size(px.data), 64, 'Correct number of data points');
});
