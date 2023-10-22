// math.js
function add(a, b) {
    return a + b;
}

// Test for addition where the result is expected to be equal to 5
test('add function - result is equal to 5', () => {
    expect(add(2, 3)).toBe(5);
});

// Test for addition where the result is expected not to be equal to 10
test('add function - result is not equal to 10', () => {
    expect(add(4, 2)).not.toBe(10);
});

