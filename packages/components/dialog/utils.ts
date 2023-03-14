import type { Obj, Paths } from '@felte/core';

import { createForm } from '@felte/solid';
import { validator } from '@felte/validator-zod';
import { CreateMutationResult } from '@tanstack/solid-query';
import { createSignal } from 'solid-js';
import * as zod from 'zod';

import { TanstackMutationStatus } from '$/utils/tanstack';

export enum FormAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

const createDialog = () => {
  const [isOpen, setIsOpen] = createSignal<boolean>(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const toggleDialog = () => {
    setIsOpen(!isOpen());
  };

  return {
    isOpen,
    openDialog,
    closeDialog,
    toggleDialog,
  };
};

const createDialogForm = <
  // extending Obj seems to be required for the validation for the form to properly work
  TFormData extends Obj,
  TCreateInput,
  TCreateReturns,
  TUpdateInput,
  TUpdateReturns,
  TEntityIdentifier,
  TDeleteReturns,
>(
  createMutation: CreateMutationResult<TCreateReturns, unknown, TCreateInput>,
  updateMutation: CreateMutationResult<TUpdateReturns, unknown, TUpdateInput>,
  deleteMutation: CreateMutationResult<TDeleteReturns, unknown, TEntityIdentifier>,
  // seems like any is needed to support the zod schema type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formDataSchema: zod.ZodType<TFormData, any, any>,
) => {
  const dialogStore = dialogUtils.createDialog();
  const [entityIdentifier, setEntityIdentifier] = createSignal<TEntityIdentifier | undefined>();
  const [initialFormValues, setInitialFormValues] = createSignal<Partial<TFormData>>({});
  const [formWasProcessed, setFormWasProcessed] = createSignal<boolean>(false);
  const [formAction, setFormAction] = createSignal<FormAction>(FormAction.CREATE);
  const { form, errors, setFields } = createForm<zod.infer<typeof formDataSchema>>({
    extend: validator({ schema: formDataSchema }),
    initialValues: initialFormValues(),
    onSubmit: async (values) => {
      const currentEntityIdentifier = entityIdentifier();

      if (currentEntityIdentifier) {
        // @todo(refactor) investigate to see if there is a better way to type this without a cast
        // since we need the extends Obj for validation, we need as here for the mutation to work properly
        updateMutation.mutate({ identifier: currentEntityIdentifier, ...values } as TUpdateInput);

        return;
      }

      // @todo(refactor) investigate to see if there is a better way to type this without a cast
      // since we need the extends Obj for validation, we need as here for the mutation to work properly
      createMutation.mutate({ ...values } as unknown as TCreateInput);
    },
  });

  const isOpen = () => dialogStore.isOpen();

  const isProcessing = () => {
    return createMutation.isLoading || updateMutation.isLoading || deleteMutation.isLoading;
  };

  const initializeFormValues = (data: Partial<TFormData>) => {
    for (const key in data) {
      // @ts-expect-error with this being a generic, I don't know of a way to make this not error even though the code
      // it fine
      setFields(key, data[key], true);
    }
  };

  const closeDialog = () => {
    setInitialFormValues({});
    setEntityIdentifier(undefined);
    dialogStore.closeDialog();
  };

  const deleteEntity = () => {
    const identifier = entityIdentifier();

    if (!identifier) {
      return;
    }

    deleteMutation.mutate(identifier);
  };

  const initializeCreate = () => {
    setFormAction(FormAction.CREATE);
    dialogStore.openDialog();
  };

  const initializeUpdate = (entity: TFormData, identifier: Exclude<TEntityIdentifier, Function>) => {
    setFormAction(FormAction.UPDATE);
    setEntityIdentifier(identifier);
    dialogStore.openDialog();

    // this needs to happen after the dialog is enabled to make sure the html inputs are updated properly
    initializeFormValues(entity);
  };

  const initializeDelete = (identifier: Exclude<TEntityIdentifier, Function>) => {
    setFormAction(FormAction.DELETE);
    setEntityIdentifier(identifier);
    dialogStore.openDialog();
  };

  const checkForModalFormProcessed = () => {
    if (
      createMutation.status === TanstackMutationStatus.SUCCESS ||
      updateMutation.status === TanstackMutationStatus.SUCCESS ||
      deleteMutation.status === TanstackMutationStatus.SUCCESS
    ) {
      setFormWasProcessed(true);

      createMutation.reset();
      updateMutation.reset();
      deleteMutation.reset();
    }
  };

  const onDialogFormProcessed = () => {
    if (formWasProcessed()) {
      setFormWasProcessed(false);
      closeDialog();
    }
  };

  return {
    checkForModalFormProcessed,
    onDialogFormProcessed,
    isProcessing,
    deleteEntity,
    isOpen,
    openDialog: dialogStore.openDialog,
    closeDialog,
    entityIdentifier,
    form,
    errors,
    setFields,
    initialFormValues,
    initializeFormValues,
    setEntityIdentifier,
    formAction,
    setFormAction,
    initializeCreate,
    initializeUpdate,
    initializeDelete,
  };
};

export const dialogUtils = {
  createDialog,
  createDialogForm,
};
