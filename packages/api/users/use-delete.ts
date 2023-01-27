import { createMutation, useQueryClient, QueryClient } from '@tanstack/solid-query';
import remove from 'lodash/remove';

import { GetUsersListReturns } from '$/api/users/use-get-list';
import { User, UserIdentifier } from '$/data-models/user';
import { applicationUtils, GlobalVariable, TanstackQueryKey } from '$/utils/application';
import { HttpMethod, httpUtils } from '$/utils/http';

export interface DeleteUserReturns {
  user: User;
}

export const buildDeleteMutation = () => async (input: UserIdentifier) => {
  const response = await httpUtils.http(
    `${applicationUtils.getGlobalVariable(GlobalVariable.BASE_API_URL)}/users/${input.id}`,
    {
      method: HttpMethod.DELETE,
    },
  );

  return await httpUtils.parseJson<DeleteUserReturns>(response);
};

export const buildOnSuccess = (queryClient: QueryClient) => (data: DeleteUserReturns) => {
  queryClient.setQueryData([TanstackQueryKey.GET_USERS_LIST], (oldData: GetUsersListReturns | undefined) => {
    if (!oldData) {
      return;
    }

    const newData = { users: [...oldData.users] };

    remove(newData.users, { id: data.user.id });

    return newData;
  });

  queryClient.invalidateQueries({ queryKey: [TanstackQueryKey.GET_USERS_LIST] });
};

export const createDelete = () => {
  const queryClient = useQueryClient();

  return createMutation(buildDeleteMutation(), {
    onSuccess: buildOnSuccess(queryClient),
  });
};
