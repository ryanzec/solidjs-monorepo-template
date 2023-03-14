// this is just a side effect of lowdb for needing the non null assertion
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { faker } from '@faker-js/faker';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { Low } from 'lowdb';

import { Database } from '../types';

const API_PREFIX = '/api/users';

export const registerUsersApi = (api: FastifyInstance, db: Low<Database>) => {
  api.get(API_PREFIX, async (request, response) => {
    const users = db.data!.users;

    return response.code(200).send({ users });
  });

  type PostUsersRequest = FastifyRequest<{
    Body: { email: string; firstName: string; lastName: string; password: string };
  }>;

  api.post(API_PREFIX, async (request: PostUsersRequest, response) => {
    const keys = Object.keys(request.body);

    if (
      !keys.includes('firstName') ||
      !keys.includes('lastName') ||
      !keys.includes('email') ||
      !keys.includes('password')
    ) {
      return response.code(400).send();
    }

    const user = { id: faker.datatype.uuid(), ...request.body };

    db.data?.users.push(user);

    await db.write();

    return response.code(200).send({ user });
  });

  type PutUsersRequest = FastifyRequest<{
    Body: { email?: string; firstName?: string; lastName?: string; password?: string };
    Params: { userId: string };
  }>;

  api.put(`${API_PREFIX}/:userId`, async (request: PutUsersRequest, response) => {
    const existingRecord = db.data?.users.find((user) => user.id === request.params.userId);
    const existingIndex = db.data?.users.findIndex((user) => user.id === request.params.userId);

    if (!existingRecord || !existingIndex || existingIndex === -1) {
      response.code(404).send();

      return;
    }

    const updatedRecord = { ...existingRecord, ...request.body };

    db.data!.users = [
      ...db.data!.users.slice(0, existingIndex),
      updatedRecord,
      ...db.data!.users.slice(existingIndex + 1),
    ];

    await db.write();

    response.code(200).send({ user: updatedRecord });
  });

  type DeleteUsersRequest = FastifyRequest<{
    Params: { userId: string };
  }>;

  api.delete(`${API_PREFIX}/:userId`, async (request: DeleteUsersRequest, response) => {
    const deletingRecord = db.data?.users.find((user) => user.id === request.params.userId);
    const deletingIndex = db.data?.users.findIndex((user) => user.id === request.params.userId);

    if (!deletingRecord || !deletingIndex || deletingIndex === -1) {
      response.code(404).send();

      return;
    }

    db.data!.users = [...db.data!.users.slice(0, deletingIndex), ...db.data!.users.slice(deletingIndex + 1)];

    await db.write();

    response.code(200).send({ user: deletingRecord });
  });
};
