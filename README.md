# to-ava

Codemod to convert tests written in jest to ava.

Check `fixtures/` folder to see some example.

## Usage

### Install

`npm i -g to-ava`

### Run it on a Javascript file

`to-ava ./jest.test.js`

### Run it on a Typescript file

`to-ava -p=ts ./jest.test.ts`

### Run it on a folder

`to-ava -p=ts ./tests`

### Notes

It excludes files that are not test files. A file is supposed to contain tests if its name includes either `test.` either `spec.`


## Supported Assertions

- [X] `.toEqual`
- [X] `.toBe`
- [X] `.toBeNull`
- [X] `.toBeFalsy`
- [X] `.toBeTruthy`
- [X] `.toMatchSnapshot`
- [X] `.toBeDefined`
- [X] `.toBeUndefined`
- [X] `.toBeInstanceOf`
- [X] `.toBeGreaterThan`
- [X] `.toBeGreaterThanOrEqual`
- [X] `.toBeLessThan`
- [X] `.toBeLessThanOrEqual`
- [X] `.toHaveLength`
- [X] `.toHaveProperty`

## Assertions not supported

All the other assertions are not supported. Including all the assertions used in combination with `.not` - for example `.not.toBeDefined()`

Those assertions will be still transformed, however not into an ava assertion, but as a comment with the "TODO: " symbol. Thanks for the "TODO: " symbol, it will be possible to find all the assertions not transformed, and fix them manually.

For example

```js
expect(res).toContain('0')

// will be transformed into

// TODO: expect(res).toContain('0');
```

## Test

`npm t`



## TODO

- [ ] add support for beforeEach, beforeAll, afterEach, afterAll
- [ ] refactor: split the transformer into multiple functions, with clear names
- [ ] add support for more jest assertion. The list follows:
  - [ ] `.not.toBeDefined`
  - [ ] `.not.toBeNull`
  - [ ] `.not.toContain`
  - [ ] `.not.toEqual`
- [ ] add support for nested describes

## Resources

- [Ava to Jest transformers](https://github.com/skovhus/jest-codemods/blob/master/src/transformers/ava.js)
- [AST Explorer](https://astexplorer.net/)

