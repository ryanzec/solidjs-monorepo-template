// this is just a side effect of lowdb for needing the non null assertion
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { FastifyInstance } from 'fastify';
import { Low } from 'lowdb';

import { Database } from '../types';

export const registerHealthApi = (api: FastifyInstance, db: Low<Database>) => {
  api.get('/health', async (request, response) => {
    return response.status(200).send({
      userCount: db.data?.users.length ?? -1,
    });
  });
};
