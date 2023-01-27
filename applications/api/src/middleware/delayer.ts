import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

export const delayerHook = (request: FastifyRequest, response: FastifyReply, done: HookHandlerDoneFunction) => {
  setTimeout(done, 1000);
};
