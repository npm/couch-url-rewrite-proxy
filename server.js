const express = require('express')

const app = express()
const bodyParser = require('body-parser')
const request = require('request')
const replify = require('replify')
const redact = require('./lib/redact')
const rewrite = require('./lib/rewrite')

const url = require('url')

app.use(bodyParser.json({ limit: '196mb', strict: false }))
app.use(bodyParser.urlencoded({ extended: false, limit: '196mb' }))

// provide a repl; in case we continue to have
// memory leaks in this proxy.
replify('couch-url-rewrite-proxy', app)
setInterval(() => {
  if (typeof process.memoryUsage === 'function') console.log(process.memoryUsage())
}, 15000)

function CouchUrlRewriteProxy (opts) {
  function proxy (req, res, next) {
    var payload = {
      method: req.method,
      url: url.resolve(opts.upstream, req.path),
      headers: Object.assign(req.headers, {
        host: 'registry.npmjs.org'
      }),
      qs: req.query,
      json: false,
      strictSSL: false
    }
    if (~['PUT', 'POST', 'DELETE'].indexOf(req.method)) {
      payload.json = true
      payload.body = req.body
    }

    var rewrite
    if (
      !req.path.match(/\/-\//) && // CouchDB API URLs.
      !req.path.match(/\/_changes\/?/) && // Changes feed.
      !req.path.match(/\.tgz$/) && // tarball URLs.
      req.method === 'GET' // we should only rewrite GET requests!
    ) {
      payload.gzip = true
      rewrite = true
    } else {
      rewrite = false
    }

    // see: https://github.com/request/request/issues/2478
    if (!rewrite) {
      request(payload).pipe(res)
    } else {
      request(payload, function (err, response, body) {
        res.header('content-type', 'application/json')
        var status = 500
        if (response && response.statusCode) status = response.statusCode
        if (err) res.status(status).send(body)
        else if (rewrite) {
          rewriteUrls(res, status, body, opts.frontDoorHost)
        }
      })
    }
  }

  ['put', 'post', 'delete', 'get', 'head'].forEach(function (method) {
    app[method](/.*/, proxy)
  })
}

function rewriteUrls (res, status, body, frontDoorHost) {
  try {
    body = rewrite(redact(body), frontDoorHost)
  } catch (err) {
    console.error(err.message)
  }
  res.status(status).send(body)
}

module.exports = function (opts, cb) {
  cb = cb || function () {}
  CouchUrlRewriteProxy(opts)
  console.info('routing', opts.port, 'to', opts.upstream)
  console.info('rewriting to FRONT_DOOR_HOST =', opts.frontDoorHost)
  var server = app.listen(opts.port, function () {
    console.info('listening on ', opts.port)
    return cb(null, server)
  })
}
