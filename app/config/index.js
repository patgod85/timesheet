var nconf = require('nconf');
var path = require('path');

var node_env = process.env.NODE_ENV || 'demo';

nconf.argv()
    .env()
    .file({file: path.join(__dirname, 'config.' + node_env + '.json')});

module.exports = nconf;