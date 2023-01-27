import { createCreate, CreateUserReturns } from '$/api/users/use-create';
import { createDelete, DeleteUserReturns } from '$/api/users/use-delete';
import { createGetList, GetUsersListReturns } from '$/api/users/use-get-list';
import { createUpdate, UpdateUserReturns } from '$/api/users/use-update';

export type { CreateUserReturns, GetUsersListReturns, DeleteUserReturns, UpdateUserReturns };

export const usersApi = {
  createGetList,
  createCreate,
  createDelete,
  createUpdate,
};
