let findParentDir = require('find-parent-dir');
let path = require('path');

const repoName = 'BNRY_BRIDGE_2_MVP'
const repoRootDir = findParentDir.sync(__dirname, repoName);

/*
since zeppelin js code is require from different locations depending
on coverage mode or not, it needs to be required using an absolute path.
*/
module.exports.ZEPPELIN_LOCATION = path.join(repoRootDir, repoName, 'node_modules') + '/';

module.exports.ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';