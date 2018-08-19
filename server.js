'use strict';

const crypto = require('crypto');
const db = new Map();

function hashPass(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

function createUser(username, password) {
  if (db.has(username)) {
    throw new Error('Username exists');
  }
  const hash = hashPass(password);
  db.set(username, hash);
}

function verifyUser(username, password) {
  if (!db.has(username)) {
    return false;
  }
  const hash1 = db.get(username);
  const hash2 = hashPass(password);
  if (hash1 === hash2) {
    return true;
  }
  return false;
}
//                  0           1               2
// process.argv = ['node', 'server.js', 'hello world'];
// const arg = process.argv[2];
// const hash = hashPass(arg);
// console.log(hash);

createUser('Chjango', 'foobar');
console.log(verifyUser('Chjango', 'foobar2'));
