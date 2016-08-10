# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.2.3"></a>
## [1.2.3](https://github.com/npm/couch-url-rewrite-proxy/compare/v1.2.2...v1.2.3) (2016-08-10)


### Bug Fixes

* failing to parse response from npm dist-tag add ([#8](https://github.com/npm/couch-url-rewrite-proxy/issues/8)) ([d9f4792](https://github.com/npm/couch-url-rewrite-proxy/commit/d9f4792))



<a name="1.2.2"></a>
## [1.2.2](https://github.com/npm/couch-url-rewrite-proxy/compare/v1.2.1...v1.2.2) (2016-07-29)


### Bug Fixes

* pipe _changes directly through to upstream server ([#7](https://github.com/npm/couch-url-rewrite-proxy/issues/7)) ([a8b65a9](https://github.com/npm/couch-url-rewrite-proxy/commit/a8b65a9))



<a name="1.2.1"></a>
## [1.2.1](https://github.com/npm/couch-url-rewrite-proxy/compare/v1.2.0...v1.2.1) (2016-07-28)


### Bug Fixes

* don't set host to registry.npmjs.org, this breaks _changes ([#6](https://github.com/npm/couch-url-rewrite-proxy/issues/6)) ([326aa70](https://github.com/npm/couch-url-rewrite-proxy/commit/326aa70))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/npm/couch-url-rewrite-proxy/compare/v1.0.0...v1.2.0) (2016-07-18)


### Bug Fixes

* allow for much larger body sizes ([#5](https://github.com/npm/couch-url-rewrite-proxy/issues/5)) ([d498cbc](https://github.com/npm/couch-url-rewrite-proxy/commit/d498cbc))


### Features

* create a bin for executing the rewrite proxy ([#4](https://github.com/npm/couch-url-rewrite-proxy/issues/4)) ([f01eef9](https://github.com/npm/couch-url-rewrite-proxy/commit/f01eef9))
* proxy now rewrites package JSON as it is served ([#3](https://github.com/npm/couch-url-rewrite-proxy/issues/3)) ([5870a75](https://github.com/npm/couch-url-rewrite-proxy/commit/5870a75))
* route tarballs directly through to the client ([#2](https://github.com/npm/couch-url-rewrite-proxy/issues/2)) ([a071e6c](https://github.com/npm/couch-url-rewrite-proxy/commit/a071e6c))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/npm/couch-url-rewrite-proxy/compare/v1.1.0...v1.1.1) (2016-07-07)


### Bug Fixes

* also add req param parsing ([ee8ae12](https://github.com/npm/couch-url-rewrite-proxy/commit/ee8ae12))
* need body-parser dependency TODO: add test for post ([fd0d821](https://github.com/npm/couch-url-rewrite-proxy/commit/fd0d821))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/npm/couch-url-rewrite-proxy/compare/v1.0.0...v1.1.0) (2016-07-07)


### Features

* add bin for running proxy ([5aa60ca](https://github.com/npm/couch-url-rewrite-proxy/commit/5aa60ca))
* proxy now rewrites package JSON as it is served ([#3](https://github.com/npm/couch-url-rewrite-proxy/issues/3)) ([5870a75](https://github.com/npm/couch-url-rewrite-proxy/commit/5870a75))
* route tarballs directly through to the client ([#2](https://github.com/npm/couch-url-rewrite-proxy/issues/2)) ([a071e6c](https://github.com/npm/couch-url-rewrite-proxy/commit/a071e6c))



<a name="1.0.0"></a>
# 1.0.0 (2016-06-23)


### Bug Fixes

* tweaks to get build and coverage working ([#1](https://github.com/npm/couch-url-rewrite-proxy/issues/1)) ([4c0c5e8](https://github.com/npm/couch-url-rewrite-proxy/commit/4c0c5e8))


### Features

* rough out repo structure ([336fff3](https://github.com/npm/couch-url-rewrite-proxy/commit/336fff3))
