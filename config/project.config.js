/* eslint key-spacing:0 spaced-comment:0 */
const path = require('path')
const debug = require('debug')('app:config:project')
const { argv } = require('yargs')
const ip = require('ip')

debug('Creating default configuration.')
const env = process.env.NODE_ENV || 'development'
const __DEV__ = env === 'development'
const __PROD__ = env === 'production'
const __TEST__ = env === 'test'
const __COVERAGE__ = !argv.watch && env === 'test'
const __BASENAME__ = JSON.stringify(process.env.BASENAME || '/')

// ========================================================
// Default Configuration
// ========================================================
let config = {
  env,
  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base  : path.resolve(__dirname, '..'),
  dir_src : 'src',
  dir_dist : 'dist',
  dir_assets: 'assets',
  dir_public : 'public',
  dir_server : 'server',
  dir_test   : 'tests'
}

// ------------------------------------
// Utilities
// ------------------------------------
const base = (...args) => path.resolve(...[config.path_base, ...args])
// function base () {
//   const args = [config.path_base].concat([].slice.call(arguments))
//   return path.resolve.apply(path, args)
// }

const paths = {
  base   : base,
  src : base.bind(null, config.dir_src),
  public : base.bind(null, config.dir_public),
  dist : base.bind(null, config.dir_dist)
}

config = Object.assign({}, config, {
  paths,
  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_host : ip.address(), // use string 'localhost' to prevent exposure on local network
  server_port : process.env.PORT || 4444,

    // ----------------------------------
    // Compiler Configuration
    // ----------------------------------
  compiler_devtool :  'cheap-source-map',
  compiler_hash_type : 'hash',
  compiler_babel : {
    cacheDirectory : true,
    plugins : ['transform-runtime'],
    presets : [[ 'es2015', { 'modules': false } ], 'react', 'stage-0']
  },
  compiler_fail_on_warning : false,
  compiler_quiet : false,
  compiler_public_path : __BASENAME__,
  compiler_stats : {
    hash: false,            // the hash of the compilation
    version: false,         // webpack version info
    timings: true,          // timing info
    assets: true,           // assets info
    chunks: false,          // chunk info
    colors: true,           // with console colors
    chunkModules: false,    // built modules info to chunk info
    modules: false,         // built modules info
    cached: false,          // also info about cached (not built) modules
    reasons: false,         // info about the reasons modules are included
    source: false,          // the source code of modules
    errorDetails: true,     // details to errors (like resolving log)
    chunkOrigins: false,    // the origins of chunks and chunk merging info
    modulesSort: '',        // (string) sort the modules by that field
    chunksSort: '',         // (string) sort the chunks by that field
    assetsSort: ''          // (string) sort the assets by that field
  },
  compiler_vendors : [
    'react',
    'react-redux',
    'react-router',
    'redux'
  ],

  // ------------------------------------
  // Environment
  // ------------------------------------
  compiler_globals: {
    'process.env': {
      NODE_ENV: JSON.stringify(env)
    },
    __DEBUG__: !!argv.debug,
    __PATH_SEP__: JSON.stringify(path.sep),
    __DEV__,
    __PROD__,
    __TEST__,
    __COVERAGE__,
    __BASENAME__
  },

  // ----------------------------------
  // Test Configuration
  // ----------------------------------
  // N.B.: globals added here must _also_ be added to .eslintrc
  coverage_reporters : {
    reporters: [
      { type : 'text-summary' },
      { type : 'lcov', dir : 'coverage', subdir: '.' }
    ],
    includeAllSources: true
  }
})

/************************************************
 -------------------------------------------------
 All Internal Configuration Below
 Edit at Your Own Risk
 -------------------------------------------------
 ************************************************/

// ------------------------------------
// Validate Vendor Dependencies
// ------------------------------------
const pkg = require('../package.json')

config.compiler_vendors = config.compiler_vendors
        .filter((dep) => {
          if (pkg.dependencies[dep]) return true
          debug(
            `Package "${dep}" was not found as an npm dependency in package.json; ` +
            `it won't be included in the webpack vendor bundle.
            Consider removing it from \`compiler_vendors\` in ~/config/index.js`
          )
        })

// ========================================================
// Environment Configuration
// ========================================================
debug(`Looking for environment overrides for NODE_ENV "${config.env}".`)
const environments = require('./environments.config')
const overrides = environments[config.env]
if (overrides) {
  debug('Found overrides, applying to default configuration.')
  Object.assign(config, overrides(config))
} else {
  debug('No environment overrides found, defaults will be used.')
}

module.exports = config
