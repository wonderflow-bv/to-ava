# codemod-from-jest-to-ava

Codemod to convert tests written in jest to ava.

Check `fixtures/` folder to see which type of tests are supported.

## Usage

### Run codemod on a test file

```bash
npm i -g jscodeshift

jscodeshift -t lib/mege-describes-into-its.js ./fixtures/simple-test-1-input.js -d -p
```


## Test

`npm t`

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



## TODO

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

