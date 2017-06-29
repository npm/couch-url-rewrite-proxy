// redact fields from package.json that should have been obfuscated.
const redactSSORegex = /"sso":\s*"[^"]*"/g
const replacement = '[SECRET]'

module.exports = function (body) {
  if (isPackageJson(body)) {
    return body.replace(redactSSORegex, `"sso":"${replacement}"`)
  }
}

// detect whether or not this payload is
// package meta information vs., as an example,
// the login dance.
function isPackageJson (body) {
  // checking for "name" and "versions", this should be sufficient.
  return body.indexOf('"name"') !== -1 && body.indexOf('"versions"') !== -1
}
