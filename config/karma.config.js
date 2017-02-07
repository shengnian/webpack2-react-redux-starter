const argv = require('yargs').argv
const project = require('./project.config')
const webpackConfig = require('./webpack.config')
const debug = require('debug')('app:config:karma')

debug('Creating configuration.')
const karmaConfig = {
  basePath : process.cwd(), // project root in relation to bin/karma.js
  browsers : ['PhantomJS'],
  singleRun     : !argv.watch,
  frameworks    : ['phantomjs-shim', 'mocha'],
  reporters     : ['mocha'],
  files    : [
    {
      pattern  : `./${project.dir_test}/test-bundler.js`,
      watched  : false,
      served   : true,
      included : true
    }
  ],
  formatError(msg) {
    let haveSeenStack = false
    return msg
      .split('\n')
      .reduce((list, line) => {
        // filter out node_modules
        if (/~/.test(line)) return list

        // indent the error beneath the it() message
        let newLine = '  ' + line

        if (newLine.includes('webpack:///')) {
          if (haveSeenStack === false) {
            const indent = newLine.slice(0, newLine.search(/\S/))
            newLine = `\n${indent}Stack:\n${newLine}`
            haveSeenStack = true
          }

          // remove webpack:///
          newLine = newLine.replace('webpack:///', '')

          // remove bundle location, showing only the source location
          newLine = newLine.slice(0, newLine.indexOf(' <- '))
        }

        return list.concat(newLine)
      }, [])
      .join('\n')
  },
  preprocessors : {
    [`${project.dir_test}/test-bundler.js`] : ['webpack', 'sourcemap']
  },
  client: {
    mocha: {
      reporter: 'html',   // change Karma's debug.html to mocha web reporter
      ui: 'bdd'
    }
  },
  webpack  : {
    devtool : 'cheap-module-source-map',
    resolve : Object.assign({}, webpackConfig.resolve, {
      alias : Object.assign({}, webpackConfig.resolve.alias, {
        sinon : 'sinon/pkg/sinon.js'
      })
    }),
    plugins : webpackConfig.plugins,
    module  : {
      noParse : [
        /\/sinon\.js/
      ],
      rules: webpackConfig.module.rules.concat([
        {
          test   : /sinon(\\|\/)pkg(\\|\/)sinon\.js/,
          loader : 'imports-loader?define=>false,require=>false'
        }
      ])
    },
    externals : webpackConfig.externals
  },
  webpackMiddleware : {
    progress: false,
    stats: project.compiler_stats,
    debug: true,
    noInfo: false,
    quiet: false,
  },
  coverageReporter : project.coverage_reporters
}

if (project.compiler_globals.__COVERAGE__) {
  karmaConfig.reporters.push('coverage')
    // karmaConfig.webpack.module.preLoaders = [{
  karmaConfig.webpack.module.rules.push({
    test    : /\.(js|jsx)$/,
    enforce: 'pre',
    include : new RegExp(project.dir_src),
    exclude : /node_modules/,
    loader  : 'babel-loader',
    query   : Object.assign({}, project.compiler_babel, {
      plugins : (project.compiler_babel.plugins || []).concat('istanbul')
    })
  })
}

module.exports = (cfg) => cfg.set(karmaConfig)
