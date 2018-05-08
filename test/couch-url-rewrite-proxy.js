/* global describe, it, before, after */

var fs = require('fs')
var nock = require('nock')
var proxy = require('../server')
var request = require('request')
var targz = require('tar.gz')

require('chai').should()

console.info = function () {}
console.error = function () {}

describe('couch-url-rewrite-proxy', function () {
  var server = null

  before(function (done) {
    proxy({
      port: 9999,
      upstream: 'http://www.example.com',
      frontDoorHost: 'http://www.example.com'
    }, function (err, _server) {
      if (err) return done(err)
      server = _server
      return done()
    })
  })

  it('serves a .tgz URL directly', function (done) {
    var tarPath = '/tiny-tarball/-/tiny-tarball-1.0.0.tgz'
    var entries = []
    var expected = [
      'package/package.json',
      'package/README.md',
      'package/index.js',
      'package/test'
    ]
    var tarball = nock('http://www.example.com')
      .get(tarPath)
      .reply(200, fs.readFileSync('./test/fixtures/tiny-tarball.tgz'))
    var parse = targz().createParseStream()
    var read = request.get('http://localhost:9999' + tarPath)

    parse.on('entry', function (entry) {
      entries.push(entry.path)
    })
    parse.on('end', function () {
      entries.should.deep.equal(expected)
      tarball.done()
      return done()
    })
    read.pipe(parse)
  })

  it('rewrites package JSON as it is served', function (done) {
    var jsonPath = '/tiny-tarball'
    var json = nock('http://www.example.com')
      .get(jsonPath)
      .reply(200, fs.readFileSync('./test/fixtures/tiny-tarball.json'))

    request.get({
      url: 'http://localhost:9999' + jsonPath,
      json: true
    }, function (err, res, body) {
      if (err) return done(err)
      json.done()
      body.versions['1.0.0'].dist.tarball.should.equal(
        'http://www.example.com/tiny-tarball/-/tiny-tarball-1.0.0.tgz'
      )
      return done()
    })
  })

  it('rewrites gzipped JSON as it is served', function (done) {
    var jsonPath = '/tiny-tarball'
    var json = nock('http://www.example.com')
      .get(jsonPath)
      .reply(200, fs.readFileSync('./test/fixtures/lodash.gz'), {
        'Content-Encoding': 'gzip'
      })

    request.get({
      url: 'http://localhost:9999' + jsonPath,
      json: true
    }, function (err, res, body) {
      if (err) return done(err)
      json.done()
      Object.keys(body.versions).forEach((version) => {
        body.versions[version].dist.tarball.should.equal(`http://www.example.com/lodash/-/lodash-${version}.tgz`)
      })
      return done()
    })
  })

  it('rewrites multiple old-style tarball URLs', function (done) {
    var jsonPath = '/tiny-tarball'
    var json = nock('http://www.example.com')
      .get(jsonPath)
      .reply(200, fs.readFileSync('./test/fixtures/express.json'))

    request.get({
      url: 'http://localhost:9999' + jsonPath,
      json: true
    }, function (err, res, body) {
      if (err) return done(err)
      res.headers['content-type'].should.equal('application/json; charset=utf-8')
      json.done()
      Object.keys(body.versions).forEach((version) => {
        body.versions[version].dist.tarball.should.match(/http:\/\/www.example.com\/express\/-\/express-.*/)
      })
      return done()
    })
  })

  it('rewrites new-style scoped URLs', function (done) {
    var jsonPath = '/tiny-tarball'
    var json = nock('http://www.example.com')
      .get(jsonPath)
      .reply(200, fs.readFileSync('./test/fixtures/new-scoped.json'))

    request.get({
      url: 'http://localhost:9999' + jsonPath,
      json: true
    }, function (err, res, body) {
      if (err) return done(err)
      json.done()
      Object.keys(body.versions).forEach((version) => {
        body.versions[version].dist.tarball.should.equal(`http://www.example.com/@/@npm/restify-monitor/_attachments/restify-monitor-${version}.tgz`)
      })
      return done()
    })
  })

  it('rewrites new-style unscoped URLs', function (done) {
    var jsonPath = '/tiny-tarball'
    var json = nock('http://www.example.com')
      .get(jsonPath)
      .reply(200, fs.readFileSync('./test/fixtures/new-unscoped.json'))

    request.get({
      url: 'http://localhost:9999' + jsonPath,
      json: true
    }, function (err, res, body) {
      if (err) return done(err)
      json.done()
      Object.keys(body.versions).forEach((version) => {
        body.versions[version].dist.tarball.should.equal(`http://www.example.com/y/yargs/_attachments/yargs-${version}.tgz`)
      })
      return done()
    })
  })

  it('handles corgi documents', function (done) {
    var jsonPath = '/tiny-tarball'
    var json = nock('http://www.example.com')
      .get(jsonPath)
      .reply(200, fs.readFileSync('./test/fixtures/corgi.json'))

    request.get({
      url: 'http://localhost:9999' + jsonPath,
      json: true
    }, function (err, res, body) {
      if (err) return done(err)
      json.done()
      Object.keys(body.versions).forEach((version) => {
        body.versions[version].dist.tarball.should.equal(`http://www.example.com/chalk/-/chalk-${version}.tgz`)
      })
      return done()
    })
  })

  it('handles a malformed JSON response', function (done) {
    var jsonPath = '/tiny-tarball'
    var json = nock('http://www.example.com')
      .get(jsonPath)
      .reply(200, fs.readFileSync('./test/fixtures/tiny-tarball.tgz'))

    request.get({
      url: 'http://localhost:9999' + jsonPath
    }, function (err, res, body) {
      if (err) return done(err)
      json.done()
      res.statusCode.should.equal(200)
      res.body.should.equal(fs.readFileSync('./test/fixtures/tiny-tarball.tgz', 'utf-8'))
      return done()
    })
  })

  describe('redact fields', () => {
    it('redacts fields that should not have been written to CouchDB', function (done) {
      var jsonPath = '/tiny-tarball'
      var json = nock('http://www.example.com')
        .get(jsonPath)
        .reply(200, fs.readFileSync('./test/fixtures/should-redact.json'))

      request.get({
        url: 'http://localhost:9999' + jsonPath,
        json: true
      }, function (err, res, body) {
        if (err) return done(err)
        json.done()
        res.statusCode.should.equal(200)
        const version = body.versions['1.0.0']
        body.maintainers[0].sso.should.equal('[SECRET]')
        version.maintainers[0].sso.should.equal('[SECRET]')
        version._npmUser.sso.should.equal('[SECRET]')
        return done()
      })
    })

    it('does not redact fields if response does not resemble package.json', function (done) {
      var jsonPath = '/login'
      var json = nock('http://www.example.com')
        .get(jsonPath)
        .reply(200, {
          // there's no versions field, so it doesn't
          // look like package JSON.
          name: 'some-name',
          sso: 'http://super-secret'
        })

      request.get({
        url: 'http://localhost:9999' + jsonPath,
        json: true
      }, function (err, res, body) {
        if (err) return done(err)
        json.done()
        res.statusCode.should.equal(200)
        body.sso.should.equal('http://super-secret')
        return done()
      })
    })
  })

  after(function () {
    server.close()
  })
})
