
//imports potion constructor into the test
const Potion = require('../lib/Potion');

//will replace constructor with hardcoded data for testing
jest.mock('../lib/Potion');

console.log(new Potion());
//using the new keyword to make a new potion object

test('creates a health potion object', () => {
    const potion = new Potion('health');

    expect(potion.name).toBe('health');
    expect(potion.value).toEqual(expect.any(Number));
});

test('creates a random potion object', () => {
    const potion = new Potion();

    expect(potion.name).toEqual(expect.any(String));
    expect(potion.name.length).toBeGreaterThan(0);
    expect(potion.value).toEqual(expect.any(Number));
});
