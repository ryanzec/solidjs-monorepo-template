import { createMutation, useQueryClient, QueryClient } from '@tanstack/solid-query';

import { GetUsersListReturns } from '$/api/users/use-get-list';
import { CreateUserInput, User } from '$/data-models/user';
import { applicationUtils, GlobalVariable, TanstackQueryKey } from '$/utils/application';
import { HttpMethod, httpUtils } from '$/utils/http';

export interface CreateUserReturns {
  user: User;
}

export const buildCreateMutation = () => async (input: CreateUserInput) => {
  const response = await httpUtils.http(`${applicationUtils.getGlobalVariable(GlobalVariable.BASE_API_URL)}/users`, {
    method: HttpMethod.POST,
    payload: input,
  });

  return await httpUtils.parseJson<CreateUserReturns>(response);
};

export const buildOnSuccess = (queryClient: QueryClient) => (data: CreateUserReturns) => {
  queryClient.setQueryData([TanstackQueryKey.GET_USERS_LIST], (oldData: GetUsersListReturns | undefined) => {
    if (!oldData) {
      return;
    }

    const newData = { users: [...oldData.users] };

    newData.users.push(data.user);

    return newData;
  });

  queryClient.invalidateQueries({ queryKey: [TanstackQueryKey.GET_USERS_LIST] });
};

export const createCreate = () => {
  const queryClient = useQueryClient();

  return createMutation(buildCreateMutation(), {
    onSuccess: buildOnSuccess(queryClient),
  });
};
