import type { Errors, Writable } from '@felte/core';
import type { FelteAccessor } from '@felte/solid/dist/esm/create-accessor';

import { createForm } from '@felte/solid';
import { validator } from '@felte/validator-zod';
import { createEffect, For } from 'solid-js';
import * as zod from 'zod';

import Button from '$/components/button/button';
import { ButtonContext } from '$/components/button/utils';
import FormField from '$/components/form-field';
import Input from '$/components/input/input';
import Label from '$/components/label';
import ValidationMessage from '$/components/validation-message';
import { formStoreUtils } from '$/stores/form-store';
import { zodUtils } from '$/utils/zod';

export default {
  title: 'Packages/Components/Form',
};

interface NestStructure {
  partA: string;
  partB?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  checkbox: string[];
  radio: string;
  select: string;
  arrayFields: NestStructure[];
}

const formDataSchema = zodUtils.schemaForType<FormData>()(
  zod.object({
    firstName: zod.string().min(1, 'Everyone has a first name, right?'),
    lastName: zod.string().min(1, 'Required'),
    email: zod.string().min(1, 'Required'),
    password: zod.string().min(1, 'Required'),
    checkbox: zod.string().array().min(1, 'Required'),
    radio: zod.string().min(1, 'Required'),
    select: zod.string().min(1, 'Required'),
    arrayFields: zod
      .object({
        partA: zod.string().min(1, 'Required'),
        partB: zod.string().optional(),
      })
      .array()
      .min(1, 'Required'),
  }),
);

interface UserFormFieldsProps {
  errors: FelteAccessor<Errors<FormData>> & Writable<Errors<FormData>>;
  arrayFields: FormData['arrayFields'];
  addArrayField: () => void;
  removeArrayField: (removeIndex: number) => void;
}

const UserFormFields = (props: UserFormFieldsProps) => {
  return (
    <>
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
        <Input type="checkbox" name="checkbox" value="test1" /> test1
        <br />
        <Input type="checkbox" name="checkbox" value="test2" /> test2
        <br />
        <Input type="checkbox" name="checkbox" value="test3" /> test3
        <br />
        <Input type="checkbox" name="checkbox" value="test4" /> test4
        <ValidationMessage messages={props.errors().checkbox} />
      </FormField>
      <FormField>
        <Label>Radio</Label>
        <Input type="radio" name="radio" value="on" /> on
        <br />
        <Input type="radio" name="radio" value="off" /> off
        <ValidationMessage messages={props.errors().radio} />
      </FormField>
      <FormField>
        <Label>Select</Label>
        <select name="select">
          <option value="">Select...</option>
          <option value="select1">Select 1</option>
          <option value="select2">Select 2</option>
          <option value="select3">Select 3</option>
        </select>
        <ValidationMessage messages={props.errors().select} />
      </FormField>
      <For each={props.arrayFields}>
        {(arrayField, index) => {
          return (
            <>
              <FormField>
                <Label>Part A</Label>
                <Input type="text" name={`arrayFields.${index()}.partA`} />
                <ValidationMessage messages={props.errors().firstName} />
              </FormField>
              <FormField>
                <Label>Part B</Label>
                <Input type="text" name={`arrayFields.${index()}.partB`} />
                <ValidationMessage messages={props.errors().lastName} />
              </FormField>
              <Button context={ButtonContext.DANGER} onclick={() => props.removeArrayField(index())}>
                REMOVE
              </Button>
            </>
          );
        }}
      </For>
      <Button type="button" onclick={() => props.addArrayField()}>
        + Add Array Field
      </Button>
    </>
  );
};

export const Default = () => {
  const { form, data, addArrayField, removeArrayField, setValue } = formStoreUtils.createForm<FormData>({
    schema: formDataSchema,
    initialValues: {
      firstName: 'first',
    },
    onSubmit: (values) => {
      console.log(data);
    },
    onValueChanged: (name, value) => {
      console.log(name, value);
    },
  });
  const {
    // form,
    // data: data2,
    errors,
    // setFields,
  } = createForm<zod.infer<typeof formDataSchema>>({
    extend: validator({ schema: formDataSchema }),
    initialValues: {
      radio: 'off',
      checkbox: ['test1'],
    },
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <div>
      <Button onclick={() => setValue('lastName', 'last')}>test simple value</Button>
      <Button onclick={() => setValue('checkbox', ['test2', 'test3'])}>test array value</Button>
      <form use:form>
        <FormField>
          <Label>First Name</Label>
          <input type="text" name="firstName" />
          <ValidationMessage messages={errors().firstName} />
        </FormField>
        <UserFormFields
          errors={errors}
          arrayFields={data().arrayFields}
          addArrayField={() => addArrayField('arrayFields')}
          removeArrayField={(removeIndex: number) => removeArrayField('arrayFields', removeIndex)}
        />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};
