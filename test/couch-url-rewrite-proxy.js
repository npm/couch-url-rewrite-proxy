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
        'http://www.example.com/t/tiny-tarball/_attachments/tiny-tarball-1.0.0.tgz'
      )
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

  after(function () {
    server.close()
  })
})
