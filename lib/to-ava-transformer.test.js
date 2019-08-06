const test = require('ava')
const jscodeshift = require('jscodeshift')
const testCodemod = require('jscodeshift-ava-tester')

const codemod = require('./to-ava-transformer')

const { testChanged } = testCodemod(jscodeshift, test, codemod)
const path = require('path')

const sourceCodeInput = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/simple-test-1-input.js'), { encoding: 'utf8' })
const sourceCodeOutput = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/simple-test-1-output.js'), { encoding: 'utf8' })

const sourceCodeComplexInput = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-1-input.js'), { encoding: 'utf8' })
const sourceCodeComplexOutput = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-1-output.js'), { encoding: 'utf8' })

const sourceCodeComplexInput2 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-2-input.js'), { encoding: 'utf8' })
const sourceCodeComplexOutput2 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-2-output.js'), { encoding: 'utf8' })

const sourceCodeComplexInput3 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-3-input.js'), { encoding: 'utf8' })
const sourceCodeComplexOutput3 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-3-output.js'), { encoding: 'utf8' })

const sourceCodeComplexInput4 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-4-input.js'), { encoding: 'utf8' })
const sourceCodeComplexOutput4 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-4-output.js'), { encoding: 'utf8' })

const sourceCodeComplexInput5 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-5-input.js'), { encoding: 'utf8' })
const sourceCodeComplexOutput5 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-5-output.js'), { encoding: 'utf8' })

testChanged(sourceCodeInput, sourceCodeOutput)
testChanged(sourceCodeComplexInput, sourceCodeComplexOutput)
testChanged(sourceCodeComplexInput2, sourceCodeComplexOutput2)
testChanged(sourceCodeComplexInput3, sourceCodeComplexOutput3)
testChanged(sourceCodeComplexInput4, sourceCodeComplexOutput4)
testChanged(sourceCodeComplexInput5, sourceCodeComplexOutput5)
// testChanged(`const a=2`, 'var a=2')
