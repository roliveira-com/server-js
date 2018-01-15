import * as jsonserver from 'json-server';
import {Express} from 'express';

import * as fs from 'fs';
import * as https from 'https';

import {handleAuth} from './auth';
import {handleAuthorization} from './authorization'


const server: Express = jsonserver.create();
const router = jsonserver.router('db.json');
const middlewares = jsonserver.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonserver.bodyParser);

// middleware de login. Cria um token usando a spec JWT
server.post('/login', handleAuth);

// middleware de autorização. Valida se o token gerado é válido
server.use('/orders', handleAuthorization);

// Use default router
server.use(router);

const options = {
  cert: fs.readFileSync('./backend/keys/cert.pem'),
  key: fs.readFileSync('./backend/keys/key.pem')
};

https.createServer(options, server).listen(3001, () => {
  console.log('JSON Server is running on https://localhost:3001')
});

