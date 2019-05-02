// TODO: Improve this file by breking this on modules
// TODO: Re implement symlink functionality and clean up directories in order to be re used with other directories
// TODO: Add symlink for view components, macros, templates etc in order to be included in the styleguide
var symlinkOrCopySync = require('symlink-or-copy').sync;
var rimraf = require('rimraf');
rimraf('docs/dist', function () { symlinkOrCopySync('dist', 'docs/dist'); });
rimraf('docs/source', function () { symlinkOrCopySync('source', 'docs/source'); });
rimraf('docs/views/macros', function () { symlinkOrCopySync('views/macros', 'docs/views/macros'); });
rimraf('docs/views/modules', function () { symlinkOrCopySync('views/modules', 'docs/views/modules'); });
rimraf('docs/views/components', function () { symlinkOrCopySync('views/components', 'docs/views/components'); });
rimraf('docs/views/inc', function () { symlinkOrCopySync('views/inc', 'docs/views/inc'); });
rimraf('docs/extensions', function () { symlinkOrCopySync('extensions', 'docs/extensions'); });
rimraf('docs/webpack.config.js', function () { symlinkOrCopySync('webpack.config.js', 'docs/webpack.config.js'); });
rimraf('docs/webpack.dev.js', function () { symlinkOrCopySync('webpack.dev.js', 'docs/webpack.dev.js'); });
