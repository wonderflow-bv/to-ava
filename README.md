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

## TODO

- [ ] add support for more jest assertion (now only `toEqual` is supported)
- [ ] add support for nested describes

## Resources

- [Ava to Jest transformers](https://github.com/skovhus/jest-codemods/blob/master/src/transformers/ava.js)
- [AST Explorer](https://astexplorer.net/)

