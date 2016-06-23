function CouchProxy (opts, cb) {
  return cb()
}

CouchProxy.prototype.stop = function (cb) {
  return cb()
}

module.exports = function (opts, cb) {
  return new CouchProxy(opts, cb)
}
