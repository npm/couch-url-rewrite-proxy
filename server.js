var express = require('express')

var app = express()
var request = require('request')
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

    request(payload, function (err, response, body) {
      var status = 500
      if (response && response.status) status = response.status
      if (err) res.status(status).send(body)
    })
    .pipe(res)
  }

  ['put', 'post', 'delete', 'get', 'head'].forEach(function (method) {
    app[method](/.*/, proxy)
  })
}

module.exports = function (opts, cb) {
  CouchUrlRewriteProxy(opts)
  var server = app.listen(opts.port, function () {
    console.info('listening on ', opts.port)
    return cb(undefined, server)
  })
}
