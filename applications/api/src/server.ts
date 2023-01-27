import type { Database } from './types';

import path from 'path';
import { fileURLToPath } from 'url';

import cors from '@fastify/cors';
import dotenv from 'dotenv';
import fastify from 'fastify';
import { Low, JSONFile } from 'lowdb';

import { registerAuthenticateApi } from './apis/authenticate';
import { registerHealthApi } from './apis/health';
import { registerUsersApi } from './apis/users';
import { delayerHook } from './middleware/delayer';

dotenv.config();

// setup the data store
// needed because we are running node is esm mode
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const file = path.join(__dirname, '../lowdb/db.json');
const adapter = new JSONFile<Database>(file);
const db = new Low<Database>(adapter);

await db.read();

if (!db.data) {
  db.data = { authenticationTokens: [], users: [] };

  await db.write();
}

const PORT = process.env.SERVER_PORT ?? 3000;

// setup the api
const api = fastify({ logger: true });

await api.register(cors, {
  origin: 'http://localhost:6006',
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  optionsSuccessStatus: 200,
  credentials: true,
});

api.addHook('preHandler', delayerHook);

// register routes
registerHealthApi(api, db);
registerAuthenticateApi(api, db);
registerUsersApi(api, db);

// start the server
const start = async () => {
  try {
    await api.listen(PORT);
  } catch (err) {
    api.log.error(err);
    process.exit(1);
  }
};

start();
