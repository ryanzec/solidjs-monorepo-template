import type { Errors, Writable } from '@felte/core';
import type { FelteAccessor } from '@felte/solid/dist/esm/create-accessor';

import { createEffect, For, Match, Switch } from 'solid-js';
import * as zod from 'zod';

import { usersApi } from '$/api/users';
import Button from '$/components/button/button';
import Dialog from '$/components/dialog/index';
import { dialogUtils, FormAction } from '$/components/dialog/utils';
import FormField from '$/components/form-field';
import Input from '$/components/input/input';
import Label from '$/components/label';
import ValidationMessage from '$/components/validation-message';
import { zodUtils } from '$/utils/zod';

export default {
  title: 'Packages/Components/Dialog',
};

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  strings: string[];
}

const formDataSchema = zodUtils.schemaForType<FormData>()(
  zod.object({
    firstName: zod.string().min(1, 'Required'),
    lastName: zod.string().min(1, 'Required'),
    email: zod.string().min(1, 'Required'),
    password: zod.string().min(1, 'Required'),
    strings: zod.string().array().min(1, 'Required'),
  }),
);

interface UserFormFieldsProps {
  errors: FelteAccessor<Errors<FormData>> & Writable<Errors<FormData>>;
}

const UserFormFields = (props: UserFormFieldsProps) => {
  return (
    <>
      <FormField>
        <Label>First Name</Label>
        <Input type="text" name="firstName" />
        <ValidationMessage messages={props.errors().firstName} />
      </FormField>
      <FormField>
        <Label>Last Name</Label>
        <Input type="text" name="lastName" />
        <ValidationMessage messages={props.errors().lastName} />
      </FormField>
      <FormField>
        <Label for="test">Email</Label>
        <Input type="text" name="email" />
        <ValidationMessage messages={props.errors().email} />
      </FormField>
      <FormField>
        <Label>Password</Label>
        <Input type="text" name="password" />
        <ValidationMessage messages={props.errors().password} />
      </FormField>
      <FormField>
        <Label>Strings</Label>
        <Input type="checkbox" name="strings" value="test1" /> test1
        <br />
        <Input type="checkbox" name="strings" value="test2" /> test2
        <br />
        <Input type="checkbox" name="strings" value="test3" /> test3
        <br />
        <Input type="checkbox" name="strings" value="test4" /> test4
        <ValidationMessage messages={props.errors().strings} />
      </FormField>
    </>
  );
};

interface UserFormProps {
  isProcessing: boolean;
  errors: FelteAccessor<Errors<FormData>> & Writable<Errors<FormData>>;
  form: (node: HTMLFormElement) => {
    destroy: () => void;
  };
}

const UserForm = (props: UserFormProps) => {
  const form = props.form;

  return (
    <form use:form>
      <UserFormFields errors={props.errors} />
      <Button disabled={props.isProcessing} type="submit">
        Submit
      </Button>
    </form>
  );
};

export const WithForm = () => {
  const userListQuery = usersApi.createGetList();
  const createUserMutation = usersApi.createCreate();
  const updateUserMutation = usersApi.createUpdate();
  const deleteUserMutation = usersApi.createDelete();
  const dialogFormStore = dialogUtils.createDialogForm(
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
    formDataSchema,
  );

  // check to see if the dialog form was processed
  createEffect(() => {
    dialogFormStore.checkForModalFormProcessed();
  });

  // close the modal if the dialog form was processed
  createEffect(() => {
    dialogFormStore.onDialogFormProcessed();
  });

  return (
    <div>
      <Button
        disabled={dialogFormStore.isProcessing()}
        onclick={() => {
          dialogFormStore.initializeCreate();
        }}
      >
        Create User
      </Button>
      <span>{userListQuery.isFetching ? 'Background Updating...' : ' '}</span>
      <Switch>
        <Match when={userListQuery.isLoading}>
          <p>Loading...</p>
        </Match>
        <Match when={userListQuery.isError}>
          <p>Error: Figure this out</p>
        </Match>
        <Match when={userListQuery.data !== undefined}>
          <ul>
            <For each={userListQuery.data?.users ?? []}>
              {(user) => (
                <li>
                  {user.firstName} {user.lastName}{' '}
                  <Button
                    onclick={() => {
                      dialogFormStore.initializeUpdate(user, { id: user.id });
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    onclick={() => {
                      dialogFormStore.initializeDelete({ id: user.id });
                    }}
                  >
                    Delete
                  </Button>
                </li>
              )}
            </For>
          </ul>
        </Match>
      </Switch>
      <Dialog isOpen={dialogFormStore.isOpen()} closeDialog={dialogFormStore.closeDialog}>
        <Switch>
          <Match when={dialogFormStore.formAction() !== FormAction.DELETE}>
            <UserForm
              form={dialogFormStore.form}
              errors={dialogFormStore.errors}
              isProcessing={dialogFormStore.isProcessing()}
            />
          </Match>
          <Match when={dialogFormStore.formAction() === FormAction.DELETE}>
            <Button
              disabled={dialogFormStore.isProcessing()}
              onclick={() => {
                dialogFormStore.deleteEntity();
              }}
            >
              Delete
            </Button>
          </Match>
        </Switch>
      </Dialog>
    </div>
  );
};
