var npm = require('../npm')

var memoized = {}

module.exports = getCreds
function getCreds (pkgScope, cb) {
  var registry = npm.config.get('registry')
  var scope = pkgScope || npm.config.get('scope')

  if (scope) {
    var scopedRegistry = npm.config.get(scope + ':registry')
    var cliRegistry = npm.config.get('registry', 'cli')
    if (scopedRegistry && !cliRegistry) registry = scopedRegistry
  }

  if (memoized[registry]) {
    return cb(null, memoized[registry].creds, memoized[registry])
  }

  var creds = npm.config.getCredentialsByURI(registry)
  creds.registry = registry

  memoized[registry] = creds

  cb(null, creds)
}
