/* global describe, it, before, after */

var proxy = require('./')

require('chai').should()

describe('couch-url-rewrite-proxy', function () {
  var server = null

  before(function (done) {
    server = proxy({}, done)
  })

  it('has a test', function () {
    'hello'.should.not.equal('goodbye')
  })

  after(function (done) {
    server.stop(done)
  })
})
