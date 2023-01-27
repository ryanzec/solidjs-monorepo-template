import { createQuery, CreateQueryResult } from '@tanstack/solid-query';

import { User } from '$/data-models/user';
import { applicationUtils, GlobalVariable, TanstackQueryKey } from '$/utils/application';
import { HttpMethod, httpUtils } from '$/utils/http';

export interface GetUsersListReturns {
  users: User[];
}

export const buildCreateQuery = () => async (): Promise<GetUsersListReturns> => {
  const response = await httpUtils.http(`${applicationUtils.getGlobalVariable(GlobalVariable.BASE_API_URL)}/users`, {
    method: HttpMethod.GET,
  });

  return await httpUtils.parseJson<GetUsersListReturns>(response);
};

export const createGetList = (): CreateQueryResult<GetUsersListReturns> => {
  return createQuery(() => [TanstackQueryKey.GET_USERS_LIST], buildCreateQuery());
};
