var npm = require('./npm')

module.exports.login = login
function login (cb) {
  _auth(null, function (err, creds, auth) {
    if (err) { return cb(err) }
    auth.login(creds, creds.registry, npm.config.get('scope'), cb)
  })
}

module.exports.auth = auth
function auth (pkgScope, cb) {
  if (!cb) {
    cb = pkgScope
    pkgScope = null
  }
  _auth(pkgScope, function (err, creds, authMod) {
    if (err) { return cb(err) }
    if (authMod.auth) {
      authMod.auth(creds, cb)
    } else {
      cb(null, creds)
    }
  })
}

module.exports.reauth = reauth
function reauth (pkgScope, cb) {
  if (!cb) {
    cb = pkgScope
    pkgScope = null
  }
  _auth(pkgScope, function (err, creds, auth) {
    if (err) { return cb(err) }
    auth.reauth ? auth.reauth(creds, cb) : auth.login(cb)
  })
}

function _auth (scope, cb) {
  npm.config.getCreds(scope, function (err, creds) {
    if (err) { return cb(err) }
    try {
      var module = require.resolve('./auth/' + npm.config.get('auth-type'))
    } catch (e) {
      return cb(new Error('no such auth module'))
    }
    cb(null, creds, require(module))
  })
}
