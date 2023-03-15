import { MockedRequest } from 'msw';
import { SetupServer } from 'msw/node';

// this is meant to cast anything to another object for testing so allowing any here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const castAnyAs = <T>(value: any): T => {
  return value as unknown as T;
};

interface SpyMockedRequest {
  url: string;
}

const subscribeToMSWRequest = (server: SetupServer) => {
  const calls: SpyMockedRequest[] = [];
  const spy = (request: MockedRequest) => {
    calls.push({
      url: request.url.toString(),
    });
  };

  // I think this is all that is going to be needed for unit testing
  server.events.on('request:start', spy);

  spy.callCount = () => calls.length;
  spy.calls = calls;
  spy.unsubscribe = () => {
    server.events.removeListener('request:start', spy);
  };

  return spy;
};

export const unitTestingUtils = {
  castAnyAs,
  subscribeToMSWRequest,
};
