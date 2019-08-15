const test = require('ava')
const jscodeshift = require('jscodeshift')
const testCodemod = require('jscodeshift-ava-tester')

const codemod = require('./to-ava-transformer')

const { testChanged } = testCodemod(jscodeshift, test, codemod)
const path = require('path')

const sourceCodeInput = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/simple-test-1-input.spec.js'), { encoding: 'utf8' })
const sourceCodeOutput = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/simple-test-1-output.spec.js'), { encoding: 'utf8' })

const sourceCodeComplexInput = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-1-input.spec.js'), { encoding: 'utf8' })
const sourceCodeComplexOutput = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-1-output.spec.js'), { encoding: 'utf8' })

const sourceCodeComplexInput2 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-2-input.spec.js'), { encoding: 'utf8' })
const sourceCodeComplexOutput2 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-2-output.spec.js'), { encoding: 'utf8' })

const sourceCodeComplexInput3 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-3-input.spec.js'), { encoding: 'utf8' })
const sourceCodeComplexOutput3 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-3-output.spec.js'), { encoding: 'utf8' })

const sourceCodeComplexInput4 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-4-input.spec.js'), { encoding: 'utf8' })
const sourceCodeComplexOutput4 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-4-output.spec.js'), { encoding: 'utf8' })

const sourceCodeComplexInput5 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-5-input.spec.js'), { encoding: 'utf8' })
const sourceCodeComplexOutput5 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-5-output.spec.js'), { encoding: 'utf8' })

const sourceCodeComplexInput6 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-6-input.spec.js'), { encoding: 'utf8' })
const sourceCodeComplexOutput6 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-6-output.spec.js'), { encoding: 'utf8' })

const sourceCodeComplexInput7 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-7-with-multiple-hooks-input.spec.js'), { encoding: 'utf8' })
const sourceCodeComplexOutput7 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-7-with-multiple-hooks-output.spec.js'), { encoding: 'utf8' })

const sourceCodeSimpleBeforeEachInput7 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/simple-before-each-1-input.spec.js'), { encoding: 'utf8' })
const sourceCodeSimpleBeforeEachOutput7 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/simple-before-each-1-output.spec.js'), { encoding: 'utf8' })

const sourceCodeComplexInput8 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-8-input.spec.js'), { encoding: 'utf8' })
const sourceCodeComplexOutput8 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-8-output.spec.js'), { encoding: 'utf8' })

const sourceCodeComplexInput9 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-9-with-multiple-test-cases-input.spec.js'), { encoding: 'utf8' })
const sourceCodeComplexOutput9 = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/complex-test-9-with-multiple-test-cases-output.spec.js'), { encoding: 'utf8' })

const sourceCodeSimpleBeforeEachWithExpectationsInBeforeEachInput = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/simple-before-each-1-with-expectations-in-before-each-input.spec.js'), { encoding: 'utf8' })
const sourceCodeSimpleBeforeEachWithExpectationsInBeforeEachOutput = require('fs').readFileSync(path.resolve(__dirname, '../fixtures/simple-before-each-1-with-expectations-in-before-each-output.spec.js'), { encoding: 'utf8' })

testChanged(sourceCodeInput, sourceCodeOutput)
testChanged(sourceCodeComplexInput, sourceCodeComplexOutput)
testChanged(sourceCodeComplexInput2, sourceCodeComplexOutput2)
testChanged(sourceCodeComplexInput3, sourceCodeComplexOutput3)
testChanged(sourceCodeComplexInput4, sourceCodeComplexOutput4)
testChanged(sourceCodeComplexInput5, sourceCodeComplexOutput5)
testChanged(sourceCodeComplexInput6, sourceCodeComplexOutput6)
testChanged(sourceCodeComplexInput7, sourceCodeComplexOutput7)
testChanged(sourceCodeComplexInput8, sourceCodeComplexOutput8)
testChanged(sourceCodeComplexInput9, sourceCodeComplexOutput9)
testChanged(sourceCodeSimpleBeforeEachInput7, sourceCodeSimpleBeforeEachOutput7)
testChanged(sourceCodeSimpleBeforeEachWithExpectationsInBeforeEachInput, sourceCodeSimpleBeforeEachWithExpectationsInBeforeEachOutput)
// testChanged(`const a=2`, 'var a=2')
