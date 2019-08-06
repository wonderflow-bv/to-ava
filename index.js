const Runner = require('jscodeshift/dist/Runner')
const chalk = require('chalk')
const { omit } = require('lodash')
const { resolve } = require('path')

module.exports = args => {
  console.log(chalk.green(chalk.bold(`Transforming using '${args.transform}' ✌`)))
  const options = Object.assign({ quote: 'single' }, omit(args, ['_', 'transform', 'path']))
  Runner.run(resolve(__dirname, `lib/to-ava-transformer.js`), args.path, options)
}
