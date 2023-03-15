import { graphql, rest } from 'msw';
import { setupServer } from 'msw/node';
import { createRoot } from 'solid-js';
import { describe, it, vi, expect, beforeAll, afterEach, afterAll, beforeEach } from 'vitest';

import { HttpMethod, httpUtils } from '$/utils/http';
import * as utils from '$/utils/query';
import { QueryData } from '$/utils/query';
import { unitTestingUtils } from '$/utils/unit-testing';

const BASE_API_URL = 'https://www.example.com';
const PRIMARY_QUERY_KEY = 'get-users';
const users = [
  {
    id: '1',
    firstName: 'test',
    lastName: 'user',
  },
];

const restHandlers = [
  rest.get(`${BASE_API_URL}/users`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ users }));
  }),
];

const server = setupServer(...restHandlers);

describe('query utils', () => {
  describe('buildDataCacheKey', () => {
    it.todo('write once code is more stable');
  });

  describe('createMutation', () => {
    it.todo('write once code is more stable');
  });

  describe('tracked mutators', () => {
    it.todo('write once code is more stable');
  });

  describe('tracked refetchers', () => {
    it.todo('write once code is more stable');
  });

  describe('tracked resource', () => {
    it.todo('write once code is more stable');
  });

  describe('cached data', () => {
    it.todo('write once code is more stable');
  });

  describe('query creation', () => {
    beforeAll(() => {
      server.listen({ onUnhandledRequest: 'error' });
    });

    afterAll(() => {
      server.close();
    });

    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      server.resetHandlers();
      vi.useRealTimers();
    });

    it.only('works without cached data', async () => {
      const requestSubscription = unitTestingUtils.subscribeToMSWRequest(server);

      const queryData: QueryData = {
        trackedMutators: {},
        trackedRefetchers: {},
        trackedResources: {},
        cachedData: {},
      };

      await createRoot(async (dispose) => {
        const [usersResource, refetchUsers, mutateUsers] = utils.createTrackedQuery(
          queryData,
          () => [PRIMARY_QUERY_KEY],
          async () => {
            return await httpUtils.http(`${BASE_API_URL}/users`, {
              method: HttpMethod.GET,
            });
          },
        );

        await vi.runAllTimersAsync();

        requestSubscription.unsubscribe();

        expect(requestSubscription.callCount()).toBe(1);

        expect(queryData.trackedMutators[PRIMARY_QUERY_KEY]).toBeDefined();
        expect(queryData.trackedRefetchers[PRIMARY_QUERY_KEY]).toBeDefined();
        expect(queryData.trackedResources[PRIMARY_QUERY_KEY]).toBeDefined();
        expect(queryData.cachedData[PRIMARY_QUERY_KEY]).toBeDefined();

        dispose();

        expect(queryData.trackedMutators[PRIMARY_QUERY_KEY]).toBe(undefined);
        expect(queryData.trackedRefetchers[PRIMARY_QUERY_KEY]).toBe(undefined);
        expect(queryData.trackedResources[PRIMARY_QUERY_KEY]).toBe(undefined);
        expect(queryData.cachedData[PRIMARY_QUERY_KEY]).toBeDefined();
      });
    });

    it('works with expired cached data', async () => {
      const requestSubscription = unitTestingUtils.subscribeToMSWRequest(server);

      const queryData: QueryData = {
        trackedMutators: {},
        trackedRefetchers: {},
        trackedResources: {},
        cachedData: { [PRIMARY_QUERY_KEY]: { data: { users } } },
      };

      await createRoot(async (dispose) => {
        const [usersResource, refetchUsers, mutateUsers] = utils.createTrackedQuery(
          queryData,
          () => [PRIMARY_QUERY_KEY],
          async () => {
            return await httpUtils.http(`${BASE_API_URL}/users`, {
              method: HttpMethod.GET,
            });
          },
        );

        await vi.runAllTimersAsync();

        requestSubscription.unsubscribe();

        expect(requestSubscription.callCount()).toBe(1);

        expect(queryData.trackedMutators[PRIMARY_QUERY_KEY]).toBeDefined();
        expect(queryData.trackedRefetchers[PRIMARY_QUERY_KEY]).toBeDefined();
        expect(queryData.trackedResources[PRIMARY_QUERY_KEY]).toBeDefined();
        expect(queryData.cachedData[PRIMARY_QUERY_KEY]).toBeDefined();

        dispose();

        expect(queryData.trackedMutators[PRIMARY_QUERY_KEY]).toBe(undefined);
        expect(queryData.trackedRefetchers[PRIMARY_QUERY_KEY]).toBe(undefined);
        expect(queryData.trackedResources[PRIMARY_QUERY_KEY]).toBe(undefined);
        expect(queryData.cachedData[PRIMARY_QUERY_KEY]).toBeDefined();
      });
    });

    it('works with unexpired cached data', async () => {
      const requestSubscription = unitTestingUtils.subscribeToMSWRequest(server);

      const queryData: QueryData = {
        trackedMutators: {},
        trackedRefetchers: {},
        trackedResources: {},
        cachedData: { [PRIMARY_QUERY_KEY]: { data: { users }, expires: new Date().getTime() + 100000 } },
      };

      await createRoot(async (dispose) => {
        const [usersResource, refetchUsers, mutateUsers] = utils.createTrackedQuery(
          queryData,
          () => [PRIMARY_QUERY_KEY],
          async () => {
            return await httpUtils.http(`${BASE_API_URL}/users`, {
              method: HttpMethod.GET,
            });
          },
        );

        await vi.runAllTimersAsync();

        requestSubscription.unsubscribe();

        expect(requestSubscription.callCount()).toBe(0);

        expect(queryData.trackedMutators[PRIMARY_QUERY_KEY]).toBeDefined();
        expect(queryData.trackedRefetchers[PRIMARY_QUERY_KEY]).toBeDefined();
        expect(queryData.trackedResources[PRIMARY_QUERY_KEY]).toBeDefined();
        expect(queryData.cachedData[PRIMARY_QUERY_KEY]).toBeDefined();

        dispose();

        expect(queryData.trackedMutators[PRIMARY_QUERY_KEY]).toBe(undefined);
        expect(queryData.trackedRefetchers[PRIMARY_QUERY_KEY]).toBe(undefined);
        expect(queryData.trackedResources[PRIMARY_QUERY_KEY]).toBe(undefined);
        expect(queryData.cachedData[PRIMARY_QUERY_KEY]).toBeDefined();
      });
    });

    it('works secondary query key', async () => {
      const requestSubscription = unitTestingUtils.subscribeToMSWRequest(server);

      const queryData: QueryData = {
        trackedMutators: {},
        trackedRefetchers: {},
        trackedResources: {},
        cachedData: {},
      };

      await createRoot(async (dispose) => {
        const secondaryKey = () => [{ test: 'test' }, ['some', 'data', 2]];
        const dataCacheKey = utils.buildDataCacheKey(PRIMARY_QUERY_KEY, secondaryKey);
        const [usersResource, refetchUsers, mutateUsers] = utils.createTrackedQuery(
          queryData,
          () => [PRIMARY_QUERY_KEY, secondaryKey],
          async () => {
            return await httpUtils.http(`${BASE_API_URL}/users`, {
              method: HttpMethod.GET,
            });
          },
        );

        await vi.runAllTimersAsync();

        requestSubscription.unsubscribe();

        expect(requestSubscription.callCount()).toBe(1);

        expect(queryData.trackedMutators[PRIMARY_QUERY_KEY]).toBeDefined();
        expect(queryData.trackedRefetchers[PRIMARY_QUERY_KEY]).toBeDefined();
        expect(queryData.trackedResources[PRIMARY_QUERY_KEY]).toBeDefined();
        expect(queryData.cachedData[dataCacheKey]).toBeDefined();

        dispose();

        expect(queryData.trackedMutators[PRIMARY_QUERY_KEY]).toBe(undefined);
        expect(queryData.trackedRefetchers[PRIMARY_QUERY_KEY]).toBe(undefined);
        expect(queryData.trackedResources[PRIMARY_QUERY_KEY]).toBe(undefined);
        expect(queryData.cachedData[dataCacheKey]).toBeDefined();
      });
    });

    it.todo('finish once code is more stable');
  });
});
