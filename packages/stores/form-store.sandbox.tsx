import { createEffect, createSignal, For, Match, Show, Switch } from 'solid-js';
import * as zod from 'zod';
import { ZodType } from 'zod';

import AutoComplete, { AutoCompleteOption, autoCompleteUtils } from '$/components/auto-complete';
import { AutoCompleteValueStore } from '$/components/auto-complete/utils';
import Button from '$/components/button';
import { ButtonContext } from '$/components/button/utils';
import Checkbox from '$/components/checkbox';
import FormField from '$/components/form-field';
import Input from '$/components/input';
import Label from '$/components/label';
import Radio from '$/components/radio';
import Textarea from '$/components/textarea';
import ValidationMessage from '$/components/validation-message';
import { formStoreUtils } from '$/stores/form-store';
import { CommonDataType } from '$/types/generic';
import { zodUtils } from '$/utils/zod';
import ExpandableCode from '$sandbox/components/expandable-code';

export default {
  title: 'Packages/Stores/Form',
};

interface NestStructure {
  partA: string;
  partB?: string;
}

interface SimpleFormData {
  title: string;
  title2?: string;
}

const simpleFormDataSchema = zodUtils.schemaForType<SimpleFormData>()(
  zod.object({
    title: zod.string().min(1, 'Required'),
  }),
);

export const SetValue = () => {
  const { form, setValue } = formStoreUtils.createForm<SimpleFormData>({
    onSubmit: () => {},
  });

  return (
    <div data-id="container">
      <form use:form>
        <FormField>
          <Label>Title</Label>
          <Input type="text" name="title" />
        </FormField>
        <Button.Group>
          <Button data-id="submit-button" type="submit">
            Submit
          </Button>
          <Button data-id="set-value-button" onClick={() => setValue('title', 'test')}>
            Set Value
          </Button>
        </Button.Group>
      </form>
    </div>
  );
};

export const InitializeWithValues = () => {
  const { form, clear } = formStoreUtils.createForm<SimpleFormData>({
    onSubmit: () => {},
    initialValues: {
      title: 'test',
      title2: 'test2',
    },
  });

  return (
    <div data-id="container">
      <form use:form>
        <FormField>
          <Label>Title</Label>
          <Input type="text" name="title" />
        </FormField>
        <FormField>
          <Label>Title2</Label>
          <Input type="text" name="title2" />
        </FormField>
        <Button.Group>
          <Button data-id="submit-button" type="submit">
            Submit
          </Button>
          <Button data-id="clear-button" onClick={() => clear()}>
            Clear
          </Button>
        </Button.Group>
      </form>
    </div>
  );
};

export const Clear = () => {
  const { form, clear } = formStoreUtils.createForm<SimpleFormData>({
    onSubmit: () => {},
    initialValues: {
      title: 'test',
      title2: 'test2',
    },
  });

  return (
    <div data-id="container">
      <form use:form>
        <FormField>
          <Label>Title</Label>
          <Input type="text" name="title" />
        </FormField>
        <FormField>
          <Label>Title2</Label>
          <Input type="text" name="title2" />
        </FormField>
        <Button.Group>
          <Button data-id="submit-button" type="submit">
            Submit
          </Button>
          <Button data-id="clear-button" onClick={() => clear()}>
            Clear
          </Button>
        </Button.Group>
      </form>
    </div>
  );
};

export const ResetWithoutInitial = () => {
  const { form, reset } = formStoreUtils.createForm<SimpleFormData>({
    onSubmit: () => {},
  });

  return (
    <div data-id="container">
      <form use:form>
        <FormField>
          <Label>Title</Label>
          <Input type="text" name="title" />
        </FormField>
        <FormField>
          <Label>Title2</Label>
          <Input type="text" name="title2" />
        </FormField>
        <Button.Group>
          <Button data-id="submit-button" type="submit">
            Submit
          </Button>
          <Button data-id="reset-button" onClick={() => reset()}>
            Reset
          </Button>
        </Button.Group>
      </form>
    </div>
  );
};

export const ResetWithInitial = () => {
  const { form, reset, clear } = formStoreUtils.createForm<SimpleFormData>({
    onSubmit: () => {},
    initialValues: {
      title: 'test',
      title2: 'test2',
    },
  });

  return (
    <div data-id="container">
      <form use:form>
        <FormField>
          <Label>Title</Label>
          <Input type="text" name="title" />
        </FormField>
        <FormField>
          <Label>Title2</Label>
          <Input type="text" name="title2" />
        </FormField>
        <Button.Group>
          <Button data-id="submit-button" type="submit">
            Submit
          </Button>
          <Button data-id="reset-button" onClick={() => reset()}>
            Reset
          </Button>
          <Button data-id="clear-button" onClick={() => clear()}>
            Clear
          </Button>
        </Button.Group>
      </form>
    </div>
  );
};

export const IsTouched = () => {
  const { form, reset, clear, isTouched } = formStoreUtils.createForm<SimpleFormData>({
    onSubmit: () => {},
    initialValues: {
      title: 'test',
    },
  });

  return (
    <div data-id="container">
      <form use:form>
        <FormField>
          <Label>Title</Label>
          <Input type="text" name="title" />
        </FormField>
        <Button.Group>
          <Button data-id="submit-button" type="submit">
            Submit
          </Button>
          <Button data-id="clear-button" onClick={() => clear()}>
            Clear
          </Button>
          <Button data-id="reset-button" onClick={() => reset()}>
            Reset
          </Button>
        </Button.Group>
      </form>
      <Show when={isTouched('title')}>
        <div data-id="is-touched-indicator">title was touched</div>
      </Show>
    </div>
  );
};

export const Events = () => {
  const [submitTriggered, setSubmitTriggered] = createSignal(false);
  const [clearEventTriggered, setClearEventTriggered] = createSignal(false);
  const [resetEventTriggered, setResetEventTriggered] = createSignal(false);
  const [valueChangedEventTriggered, setValueChangedEventTriggered] = createSignal(false);
  const { form, reset, clear, errors } = formStoreUtils.createForm<SimpleFormData>({
    schema: simpleFormDataSchema,
    onSubmit: () => {
      setSubmitTriggered(true);
    },
    initialValues: {
      title: 'test',
    },
    onReset: () => {
      setResetEventTriggered(true);
    },
    onClear: () => {
      setClearEventTriggered(true);
    },
    onValueChanged: () => {
      setValueChangedEventTriggered(true);
    },
  });

  return (
    <div data-id="container">
      <form use:form>
        <FormField>
          <Label>Title</Label>
          <Input type="text" name="title" />
          <ValidationMessage messages={errors().title?.errors} />
        </FormField>
        <Button.Group>
          <Button data-id="submit-button" type="submit">
            Submit
          </Button>
          <Button data-id="reset-button" onClick={() => reset()}>
            Reset
          </Button>
          <Button data-id="clear-button" onClick={() => clear()}>
            Clear
          </Button>
        </Button.Group>
      </form>
      <Show when={valueChangedEventTriggered()}>
        <div data-id="value-changed-event-triggered-indicator">value changed event triggered</div>
      </Show>
      <Show when={clearEventTriggered()}>
        <div data-id="clear-event-triggered-indicator">clear event triggered</div>
      </Show>
      <Show when={resetEventTriggered()}>
        <div data-id="reset-event-triggered-indicator">reset event triggered</div>
      </Show>
      <Show when={submitTriggered()}>
        <div data-id="submit-event-triggered-indicator">submit event triggered</div>
      </Show>
    </div>
  );
};

export const ValidateOnChange = () => {
  const { form, reset, clear, errors } = formStoreUtils.createForm<SimpleFormData>({
    schema: simpleFormDataSchema,
    onSubmit: () => {},
  });

  return (
    <div data-id="container">
      <form use:form>
        <FormField>
          <Label>Title</Label>
          <Input type="text" name="title" />
          <ValidationMessage messages={errors().title?.errors} />
        </FormField>
        <Button.Group>
          <Button data-id="submit-button" type="submit">
            Submit
          </Button>
          <Button data-id="reset-button" onClick={() => reset()}>
            Reset
          </Button>
          <Button data-id="clear-button" onClick={() => clear()}>
            Clear
          </Button>
        </Button.Group>
      </form>
    </div>
  );
};

export const NoValidateOnChange = () => {
  const { form, reset, clear, errors } = formStoreUtils.createForm<SimpleFormData>({
    schema: simpleFormDataSchema,
    validateOnChange: false,
    onSubmit: () => {},
  });

  return (
    <div data-id="container">
      <form use:form>
        <FormField>
          <Label>Title</Label>
          <Input type="text" name="title" />
          <ValidationMessage messages={errors().title?.errors} />
        </FormField>
        <Button.Group>
          <Button data-id="submit-button" type="submit">
            Submit
          </Button>
          <Button data-id="reset-button" onClick={() => reset()}>
            Reset
          </Button>
          <Button data-id="clear-button" onClick={() => clear()}>
            Clear
          </Button>
        </Button.Group>
      </form>
    </div>
  );
};

interface SimpleArrayFormData {
  array: NestStructure[];
}

const simpleArrayFormDataSchema = zodUtils.schemaForType<SimpleArrayFormData>()(
  zod.object({
    array: zod
      .object({
        partA: zod.string().min(1, 'Required'),
        partB: zod.string().optional(),
      })
      .array()
      .min(2, '2 Required'),
  }),
);

export const ArrayFields = () => {
  const { form, data, errors, addArrayField, removeArrayField, touchedFields } =
    formStoreUtils.createForm<SimpleArrayFormData>({
      onSubmit: () => {},
      schema: simpleArrayFormDataSchema,
    });

  return (
    <div data-id="container">
      <form use:form>
        <For each={data().array}>
          {(arrayField, index) => {
            const getArrayFieldError = () => errors().array?.[index()] ?? {};

            return (
              <div data-id="array-field-element">
                <FormField>
                  <Label>Part A</Label>
                  <Input type="text" name={`array.${index()}.partA`} />
                  <ValidationMessage messages={getArrayFieldError().partA?.errors} />
                </FormField>
                <FormField>
                  <Label>Part B</Label>
                  <Input type="text" name={`array.${index()}.partB`} />
                  <ValidationMessage messages={getArrayFieldError().partB?.errors} />
                </FormField>
                <Button
                  data-id="remove-array-field-button"
                  context={ButtonContext.DANGER}
                  onclick={() => removeArrayField('array', index())}
                >
                  REMOVE
                </Button>
              </div>
            );
          }}
        </For>
        <ValidationMessage messages={errors().array?.errors} />
        <Button data-id="add-array-field-button" type="button" onclick={() => addArrayField('array')}>
          + Add Array Field
        </Button>
        <Button.Group>
          <Button data-id="submit-button" type="submit">
            Submit
          </Button>
        </Button.Group>
      </form>
      <hr />
      <h1>Debug Tools</h1>
      <ExpandableCode label="Errors">{JSON.stringify(errors(), null, 2)}</ExpandableCode>
      <ExpandableCode label="Touched Fields">{JSON.stringify(touchedFields(), null, 2)}</ExpandableCode>
    </div>
  );
};

interface DynamicFormData {
  title: string;
  [key: string]: CommonDataType;
}

const dynamicFormDataSchema = zodUtils.schemaForType<DynamicFormData>()(
  zod.object({
    title: zod.string().min(1, 'Required'),
  }),
);

enum RandomFormFieldType {
  STRING = 'string',
  NUMBER = 'number',
  CHECKBOX = 'checkbox',
  AUTO_COMPLETE = 'auto-complete',
  RADIO = 'radio',
  TEXTAREA = 'textarea',
  ARRAY = 'array',
}

interface RandomFormField {
  name: string;
  type: RandomFormFieldType;
  validation: zod.ZodType;
}

const possibleRandomFields: RandomFormField[] = [
  {
    name: 'string',
    type: RandomFormFieldType.STRING,
    validation: zod.string().min(1, 'Required'),
  },
  {
    name: 'number',
    type: RandomFormFieldType.NUMBER,
    validation: zod.coerce.number().min(10, 'Required'),
  },
  {
    name: 'checkbox',
    type: RandomFormFieldType.CHECKBOX,
    validation: zod.string().array().min(1, 'Required'),
  },
  {
    name: 'autocomplete',
    type: RandomFormFieldType.AUTO_COMPLETE,
    validation: zod.number().array().min(1, 'must select at least 1 value'),
  },
  {
    name: 'radio',
    type: RandomFormFieldType.RADIO,
    validation: zod.string().min(1, 'Required'),
  },
  {
    name: 'textarea',
    type: RandomFormFieldType.TEXTAREA,
    validation: zod.string().min(1, 'Required'),
  },
  {
    name: 'array',
    type: RandomFormFieldType.ARRAY,
    validation: zod
      .object({
        partA: zod.string().min(1, 'Required'),
        partB: zod.string().optional(),
      })
      .array()
      .min(2, '2 Required'),
  },
];

export const DynamicFormElements = () => {
  const { form, data, setValue, errors, setSchema, addArrayField, removeArrayField, touchedFields } =
    formStoreUtils.createForm<DynamicFormData>({
      schema: dynamicFormDataSchema,
      onSubmit: (values) => {
        console.log(values);
      },
    });
  const [autoCompleteValues, setAutoCompleteValues] = createSignal<Record<string, AutoCompleteValueStore>>({});
  const [randomInputs, setRandomInputs] = createSignal<RandomFormField[]>([]);

  const addRandomField = (randomField: RandomFormField) => {
    const randomFieldName = `${randomField.name}${randomInputs().length + 1}`;

    if (randomField.type === RandomFormFieldType.AUTO_COMPLETE) {
      setAutoCompleteValues({
        ...autoCompleteValues(),
        [randomFieldName]: autoCompleteUtils.createAutoCompleteValue(),
      });
    }

    setRandomInputs([
      ...randomInputs(),
      {
        ...randomField,
        name: randomFieldName,
      },
    ]);
  };

  createEffect(() => {
    const customZodElements: Record<string, ZodType> = {};

    randomInputs().forEach((input) => {
      customZodElements[input.name] = input.validation;
    });

    setSchema(
      zodUtils.schemaForType<DynamicFormData>()(
        zod.object({
          title: zod.string().min(1, 'Required'),
          ...customZodElements,
        }),
      ),
    );
  });

  return (
    <div data-id="container">
      <For each={possibleRandomFields}>
        {(randomField) => {
          return (
            <Button data-id={`add-${randomField.type}-field`} onClick={() => addRandomField(randomField)}>
              Add {randomField.name} Field
            </Button>
          );
        }}
      </For>
      <form use:form>
        <FormField>
          <Label>Title</Label>
          <Input type="text" name="title" />
          <ValidationMessage messages={errors().title?.errors} />
        </FormField>
        <Show when={randomInputs().length > 0}>
          <For each={randomInputs()}>
            {(input) => {
              return (
                <FormField data-id={input.type}>
                  <Label>{input.name}</Label>
                  <Switch>
                    <Match when={input.type === RandomFormFieldType.STRING}>
                      <Input type="text" name={input.name} />
                    </Match>
                    <Match when={input.type === RandomFormFieldType.NUMBER}>
                      <Input type="number" name={input.name} />
                    </Match>
                    <Match when={input.type === RandomFormFieldType.CHECKBOX}>
                      <Checkbox.Group>
                        <Checkbox labelNode="checked 1" name={input.name} value="checked1" />
                        <Checkbox labelNode="checked 2" name={input.name} value="checked2" />
                        <Checkbox labelNode="checked 3" name={input.name} value="checked3" />
                      </Checkbox.Group>
                    </Match>
                    <Match when={input.type === RandomFormFieldType.RADIO}>
                      <Radio.Group>
                        <Radio labelNode="yes" name={input.name} value="yes" />
                        <Radio labelNode="no" name={input.name} value="no" />
                      </Radio.Group>
                    </Match>
                    <Match when={input.type === RandomFormFieldType.TEXTAREA}>
                      <Textarea name={input.name} />
                    </Match>
                    <Match when={input.type === RandomFormFieldType.ARRAY}>
                      <For each={data()[input.name] as NestStructure[]}>
                        {(arrayField, index) => {
                          const getArrayFieldErrors = () => errors()[input.name]?.[index()] ?? {};

                          return (
                            <div data-id="array-field-element">
                              <FormField>
                                <Label>Part A</Label>
                                <Input type="text" name={`${input.name}.${index()}.partA`} />
                                <ValidationMessage messages={getArrayFieldErrors().partA?.errors} />
                              </FormField>
                              <FormField>
                                <Label>Part B</Label>
                                <Input type="text" name={`${input.name}.${index()}.partB`} />
                                <ValidationMessage messages={getArrayFieldErrors().partB?.errors} />
                              </FormField>
                              <Button
                                data-id="remove-array-field-button"
                                context={ButtonContext.DANGER}
                                onclick={() => removeArrayField(input.name, index())}
                              >
                                REMOVE
                              </Button>
                            </div>
                          );
                        }}
                      </For>
                      <Button data-id="add-array-field-button" type="button" onclick={() => addArrayField(input.name)}>
                        + Add Array Field
                      </Button>
                    </Match>
                    <Match when={input.type === RandomFormFieldType.AUTO_COMPLETE}>
                      <AutoComplete
                        autoShowOptions
                        options={[
                          { display: 'option 1', value: 11 },
                          { display: 'option 2', value: 22 },
                          { display: 'option 3', value: 33 },
                          { display: 'option 4', value: 44 },
                        ]}
                        filterOptions={autoCompleteUtils.excludeSelectedFilter}
                        setSelected={(options: AutoCompleteOption[]) => {
                          // cast needed since auto complete values can be a number of types
                          const value = options.map((option) => option.value) as number[];

                          setValue(input.name, value);
                          autoCompleteValues()[input.name].setSelected(options);
                        }}
                        selected={autoCompleteValues()[input.name].selected()}
                        name={input.name}
                        selectedComponent={AutoComplete.SelectedOption}
                        selectableComponent={AutoComplete.SelectableOption}
                      />
                    </Match>
                  </Switch>
                  <ValidationMessage messages={errors()[input.name]?.errors} />
                </FormField>
              );
            }}
          </For>
        </Show>
        <Button data-id="submit-button" type="submit">
          Submit
        </Button>
      </form>
      <hr />
      <h1>Debug Tools</h1>
      <ExpandableCode label="Errors">{JSON.stringify(errors(), null, 2)}</ExpandableCode>
      <ExpandableCode label="Touched Fields">{JSON.stringify(touchedFields(), null, 2)}</ExpandableCode>
    </div>
  );
};
