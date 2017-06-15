#!/usr/bin/env node
const proxy = require('../server')

require('yargs') // eslint-disable-line
  .command(
    'start',
    'start the registry URL rewrite proxy',
    function (yargs) {
      return yargs
        .option('port', {
          alias: 'p',
          default: 8080,
          describe: 'what port should the proxy run on'
        })
        .option('upstream', {
          alias: 'u',
          default: 'http://127.0.0.1:9999',
          describe: 'what upstream should the proxy connect to'
        })
        .option('front-door-host', {
          alias: 'f',
          default: process.env.FRONT_DOOR_HOST || 'https://registry.example.com',
          describe: 'what external URL should tarball URLs be rewritten to'
        })
    },
    function (argv) {
      proxy(argv)
    }
  )
  .help()
  .alias('help', 'h')
  .demand(1, 'please provide a command to run')
  .argv
