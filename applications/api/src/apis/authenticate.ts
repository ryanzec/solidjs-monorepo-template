// this is just a side effect of lowdb for needing the non null assertion
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { faker } from '@faker-js/faker';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { Low } from 'lowdb';

import { Database } from '../types';

export const registerAuthenticateApi = (api: FastifyInstance, db: Low<Database>) => {
  api.post('/api/authenticate', async (request, response) => {
    // @todo(feature) check username / password

    const authenticationToken = faker.datatype.uuid();

    // just overriding the authentication token to make sure it does not get too big and nothing fancier is needed right
    // now

    // this is just a side effect of lowdb for needing the non null assertion
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    db.data!.authenticationTokens = [{ authenticationToken }];

    await db.write();

    response.code(200).send({
      authenticationToken,
    });
  });

  type GetAuthenticateCheckTokenRequest = FastifyRequest<{
    Params: { checkToken: string };
  }>;

  api.get('/api/authenticate/:checkToken', async (request: GetAuthenticateCheckTokenRequest, response) => {
    const checkToken = request.params.checkToken;
    const existingToken = db.data!.authenticationTokens.find(
      (authenticationToken) => authenticationToken.authenticationToken === checkToken,
    );

    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!existingToken) {
      return response.code(401).send();
    }

    return response.code(200).send();
  });
};
