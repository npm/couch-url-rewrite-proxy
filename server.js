var express = require('express')

var app = express()
var request = require('request')
var npmUrls = require('@npm/npm-urls')
var url = require('url')

function CouchUrlRewriteProxy (opts) {
  function proxy (req, res, next) {
    var payload = {
      method: req.method,
      url: url.resolve(opts.frontDoorHost, req.path),
      headers: req.headers,
      qs: req.query
    }
    req.headers.host = 'registry.npmjs.org'

    if (~['PUT', 'POST', 'DELETE'].indexOf(req.method)) payload.body = req.body

    var rewrite
    if (
      !req.path.match(/\/-\//) && // CouchDB API URLs.
      !req.path.match(/\.tgz$/) && // tarball URLs.
      req.method === 'GET' // we should only rewrite GET requests!
    ) {
      rewrite = true
    } else {
      rewrite = false
    }

    var r = request(payload, function (err, response, body) {
      var status = 500
      if (response && response.statusCode) status = response.statusCode
      if (err) res.status(status).send(body)
      else if (rewrite) {
        rewriteUrls(res, status, body, opts.frontDoorHost)
      }
    })

    // only pipe if we're not performing rewrite.
    if (!rewrite) r.pipe(res)
  }

  ['put', 'post', 'delete', 'get', 'head'].forEach(function (method) {
    app[method](/.*/, proxy)
  })
}

function rewriteUrls (res, status, body, frontDoorHost) {
  try {
    var json = JSON.parse(body)
    npmUrls.rewriteOldTarballUrls(frontDoorHost, json)
    res.status(status).send(JSON.stringify(json))
  } catch (err) {
    console.error(err.message)
    res.status(status).send(body)
  }
}

module.exports = function (opts, cb) {
  CouchUrlRewriteProxy(opts)
  var server = app.listen(opts.port, function () {
    console.info('listening on ', opts.port)
    return cb(undefined, server)
  })
}
