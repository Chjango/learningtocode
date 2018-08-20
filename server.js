'use strict';

const http = require('http');
const qs = require('querystring');
const db = require('./db');

const server = new http.Server();

const page = `
<!doctype html>
<html>
  <head>
    <title>chjango&apos;s domain</title>
  </head>
  <body>
    <p>__MESSAGE__</p>
    <p>Signup:</p>
    <form action="/signup" method="POST">
      <input type="text" name="username" placeholder="Username">
      <input type="password" name="password" placeholder="Password">
      <input type="submit">
    </form>
    <p>Login:</p>
    <form action="/login" method="POST">
      <input type="text" name="username" placeholder="Username">
      <input type="password" name="password" placeholder="Password">
      <input type="submit">
    </form>
  </body>
</html>
`;

function makePage(msg) {
  return page.replace(/__MESSAGE__/, msg);
}

function respond(res, code, msg) {
  const html = makePage(msg);

  res.writeHead(code, {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Length': Buffer.byteLength(html, 'utf8').toString(10)
  });

  res.end(html);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.setEncoding('utf8');
    req.on('data', (data) => {
      body += data;
    });

    req.on('error', reject);

    req.on('end', () => {
      let data;

      try {
        data = qs.parse(body);
      } catch (e) {
        data = Object.create(null);
      }

      resolve(data);
    });
  });
}

server.on('request', async (req, res) => {
  try {
    await handleRequest(req, res);
  } catch (e) {
    console.error(e.stack);
  }
});

async function handleRequest(req, res) {
  if (req.method === 'POST') {
    const body = await readBody(req);

    if (req.url === '/signup') {
      try {
        db.createUser(body.username, body.password);
      } catch (error) {
        respond(res, 400, error.message);
        return;
      }
      respond(res, 200, `You (${body.username}) are signed up.`);
      return;
    }

    if (req.url === '/login') {
      if (db.verifyUser(body.username, body.password)) {
        respond(res, 200, 'You have logged in.');
        return;
      }
      respond(res, 200, `Bad password.`);
      return;
    }

    respond(res, 404, 'Not found.');
    return;
  }

  if (req.method !== 'GET' || req.url !== '/') {
    respond(res, 404, 'Not found.');
    return;
  }

  respond(res, 200, 'Welcome!');
}

server.listen(8080, '127.0.0.1');
