import { createMutation, useQueryClient, QueryClient } from '@tanstack/solid-query';
import omit from 'lodash/omit';

import { GetUsersListReturns } from '$/api/users/use-get-list';
import { UpdateUserInput, User } from '$/data-models/user';
import { applicationUtils, GlobalVariable, TanstackQueryKey } from '$/utils/application';
import { HttpMethod, httpUtils } from '$/utils/http';

export interface UpdateUserReturns {
  user: User;
}

export const buildUpdateMutation = () => async (input: UpdateUserInput) => {
  const response = await httpUtils.http(
    `${applicationUtils.getGlobalVariable(GlobalVariable.BASE_API_URL)}/users/${input.identifier.id}`,
    {
      method: HttpMethod.PUT,
      payload: omit(input, ['identifier']),
    },
  );

  return await httpUtils.parseJson<UpdateUserReturns>(response);
};

export const buildOnSuccess = (queryClient: QueryClient) => (data: UpdateUserReturns) => {
  queryClient.setQueryData([TanstackQueryKey.GET_USERS_LIST], (oldData: GetUsersListReturns | undefined) => {
    if (!oldData) {
      return;
    }
    const newData = { users: [...oldData.users] };
    const index = newData.users.findIndex((user) => user.id === data.user.id);

    newData.users[index] = data.user;

    return newData;
  });

  queryClient.invalidateQueries({ queryKey: [TanstackQueryKey.GET_USERS_LIST] });
};

export const createUpdate = () => {
  const queryClient = useQueryClient();

  return createMutation(buildUpdateMutation(), {
    onSuccess: buildOnSuccess(queryClient),
  });
};
