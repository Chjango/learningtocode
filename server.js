'use strict';

const crypto = require('crypto');

function hashPass(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

//                  0           1               2
// process.argv = ['node', 'server.js', 'hello world'];
const arg = process.argv[2];
const hash = hashPass(arg);
console.log(hash);
