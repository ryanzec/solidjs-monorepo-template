//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// there are numerous locations where we are doing explicit casting and such which related to:
//
// - the fact that is seems like Node element are typed in a way they should not be
// - to account for the fact that we are modifying data without really knowing the exact type
//
// while there might be a better way to handle these things that I am aware of with typescript, the casting seems
// like the sanest solution for the time being and this can be refactor later if other pattern are learned
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import get from 'get-value';
import set from 'set-value';
import { Accessor, createSignal } from 'solid-js';
import * as zod from 'zod';

import { domUtils, InputType } from '$/utils/dom';
import { zodUtils } from '$/utils/zod';

export type FormDirective = (element: HTMLFormElement) => void;

export type FormErrorsData<TFormData> = {
  [K in keyof TFormData]?: {
    errors: string[];
    [key: number]: {
      [key: string]: {
        errors: string[];
      };
    };
  };
};

export type FormErrors<TFormData> = Accessor<FormErrorsData<TFormData>>;

// using unknown here allows for outside code to not have to cast to prevent typescript errors and would rather
// localize casting in this one file than having to have everything that calls this methods have to case since
// casting really does not provide any benefit as best as I can tell
export type FormSetValue<TFormData> = (name: keyof TFormData, value: unknown) => void;

export type FormData<TFormData> = Accessor<Partial<TFormData>>;

interface CreateFormOptions<TFormData extends object> {
  onSubmit: (data: Partial<TFormData>) => void;
  // since this is a generic system, not sure what else can be done besides using any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onValueChanged?: (name: keyof TFormData, value: any) => void;
  onClear?: () => void;
  onReset?: () => void;
  initialValues?: Partial<TFormData>;
  // seems like any is needed to support the zod schema type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema?: zod.ZodType<TFormData, any, any>;
  validateOnUpdate?: boolean;
}

const defaultCreateFormOptions = {
  validateOnUpdate: true,
};

const createForm = <TFormData extends object>(passedOptions: CreateFormOptions<TFormData>) => {
  const options = Object.assign({}, defaultCreateFormOptions, passedOptions);
  const [errors, setErrors] = createSignal<FormErrorsData<TFormData>>({});
  // see comment at top of file as to why explicit casting is happening
  const [data, setData] = createSignal<Partial<TFormData>>(options.initialValues ?? {});
  const [touchedFields, setTouchedFields] = createSignal<Array<keyof TFormData>>([]);
  const [formElement, setFormElement] = createSignal<Element>();

  // seems like any is needed to support the zod schema type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [schema, setSchema] = createSignal<zod.ZodType<TFormData, any, any> | undefined>(options.schema);

  const isTouched = (name: keyof TFormData) => {
    return touchedFields().includes(name);
  };

  const setAsTouched = (name: keyof TFormData) => {
    const newTouchedFields = [...touchedFields(), name];

    setTouchedFields([...new Set(newTouchedFields)]);
  };

  const removeAsTouched = (name: keyof TFormData) => {
    setTouchedFields(touchedFields().filter((fieldName) => fieldName !== name));
  };

  interface TriggerValueChangeOptions {
    isTouched?: boolean;
  }

  // forms are dynamic so allowing any value here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const triggerValueChanged = (name: string, value: any, selfOptions: TriggerValueChangeOptions = {}) => {
    if (options.onValueChanged) {
      options.onValueChanged(name as keyof TFormData, value);
    }

    if (selfOptions.isTouched !== undefined) {
      if (selfOptions.isTouched) {
        setAsTouched(name as keyof TFormData);
      } else {
        removeAsTouched(name as keyof TFormData);
      }
    }

    if (schema() && options.validateOnUpdate) {
      updateValidationErrors(name);
    }
  };

  const updateValidationErrors = (fieldName?: string) => {
    const activeSchema = schema();

    if (!activeSchema) {
      setErrors({});

      return false;
    }

    const validationResults = activeSchema.safeParse(data());

    if (validationResults.success) {
      setErrors({});

      return false;
    }

    const getErrors = (formattedErrors: { _errors: string[] }, parentPrefix = '') => {
      const errorKeys = Object.keys(formattedErrors);
      const newErrors = {};

      errorKeys.forEach((errorKey) => {
        const existingErrors = get(errors(), `${parentPrefix}${errorKey}`);

        // copy over existing errors so they don't get removed
        if (existingErrors) {
          // @ts-expect-error see comment at top of file
          newErrors[errorKey] = existingErrors;
        }

        // this seems to always be part of the result of zod formatted validation but is not useful is our case
        // as best I can tell
        if (
          errorKey === '_errors' ||
          !isTouched(`${parentPrefix}${errorKey}` as keyof TFormData) ||
          (fieldName && fieldName.indexOf(`${parentPrefix}${errorKey}`) !== 0)
        ) {
          return;
        }

        // @ts-expect-error see comment at top of file
        const currentField = formattedErrors[errorKey];
        const currentFieldKeys = Object.keys(currentField);
        const currentFieldErrors: Record<string, Record<string, { errors: string[] }>> = {};

        if (currentFieldKeys.length > 1) {
          currentFieldKeys.forEach((currentFieldKey) => {
            // this seems to always be part of the result of zod formatted validation but is not useful is our case
            // as best  I can tell
            if (currentFieldKey === '_errors') {
              return;
            }

            currentFieldErrors[currentFieldKey] = getErrors(
              currentField[currentFieldKey],
              `${errorKey}.${currentFieldKey}.`,
            );
          });
        }

        if (currentField._errors?.length > 0) {
          currentFieldErrors.errors = currentField._errors;
        }

        // @ts-expect-error see comment at top of file
        newErrors[errorKey] = currentFieldErrors;
      });

      return newErrors;
    };

    const formattedErrors = validationResults.error.format();

    // make sure any path that have errors are marked as touched so the errors are processed
    setTouchedFields([
      ...new Set([...touchedFields(), ...zodUtils.getErrorPaths<keyof TFormData>(validationResults.error)]),
    ]);

    setErrors(getErrors(formattedErrors));

    return true;
  };

  const onInput = (event: Event) => {
    // see comment at top of file as to why explicit casting is happening
    const target = event.target as HTMLInputElement;
    const name = target.name;
    const value = target.value;

    setData((oldValue) => {
      const newValue = { ...oldValue };

      set(newValue, name, value);

      // see comment at top of file as to why explicit casting is happening
      return newValue as TFormData;
    });

    // @todo(performance) might want to make this configurable if doing this on every change becomes a problem in
    // @todo(performance) certain cases
    triggerValueChanged(name, get(data(), name));
  };

  const onTextChange = (event: Event) => {
    // see comment at top of file as to why explicit casting is happening
    const target = event.target as HTMLInputElement;
    const name = target.name;

    // since this only happen when the input loses focus, this is where we want to make sure the input is marked
    // as touched
    triggerValueChanged(name, get(data(), name), {
      isTouched: true,
    });
  };

  const onCheckboxChange = (event: Event) => {
    // see comment at top of file as to why explicit casting is happening
    const target = event.target as HTMLInputElement;
    const name = target.name;
    const value = target.value;
    const checked = target.checked;
    let checkboxValue = get(data(), name);

    // if there is no value attribute, assume a true / false toggle
    if (target.attributes.getNamedItem('value') === null) {
      checkboxValue = checked;
    } else {
      if (!Array.isArray(checkboxValue)) {
        checkboxValue = [];
      }

      if (checked) {
        checkboxValue.push(value);
      } else {
        checkboxValue = checkboxValue.filter((currentValue: unknown) => currentValue !== value);
      }
    }

    setData((oldValue) => {
      const newValue = { ...oldValue };

      set(newValue, name, checkboxValue);

      return newValue;
    });

    triggerValueChanged(name, get(data(), name), { isTouched: true });
  };

  const onRadioChange = (event: Event) => {
    // see comment at top of file as to why explicit casting is happening
    const target = event.target as HTMLInputElement;
    const name = target.name;
    const value = target.value;
    const checked = target.checked;

    setData((oldValue) => {
      const newValue = { ...oldValue };

      set(newValue, name, checked ? value : '');

      return newValue;
    });

    triggerValueChanged(name, get(data(), name), { isTouched: true });
  };

  const onSelectChange = (event: Event) => {
    // see comment at top of file as to why explicit casting is happening
    const target = event.target as HTMLSelectElement;
    const name = target.name;
    const value = target.value;

    setData((oldValue) => {
      const newValue = { ...oldValue };

      set(newValue, name, value);

      return newValue;
    });

    triggerValueChanged(name, get(data(), name), { isTouched: true });
  };

  const onSubmitForm = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    const values = data();

    if (updateValidationErrors()) {
      return;
    }

    options.onSubmit(values);
  };

  const assignFormInputEventHandlers = (element: Element) => {
    const inputType = domUtils.getInputType(element);

    if (inputType === InputType.CHECKBOX) {
      element.addEventListener('change', onCheckboxChange);

      return;
    }

    if (inputType === InputType.RADIO) {
      element.addEventListener('change', onRadioChange);

      return;
    }

    if (inputType === InputType.SELECT) {
      element.addEventListener('change', onSelectChange);

      return;
    }

    element.addEventListener('input', onInput);
    element.addEventListener('change', onTextChange);
  };

  const applyValueFromStore = (element: Element) => {
    const inputType = domUtils.getInputType(element);
    const inputName = element.attributes.getNamedItem('name')?.value ?? '';

    // if the value is not in the store then we should clear out the input to make sure it reflects the stored values
    const storedValue = get(data(), inputName) ?? '';

    // there are times when the input is going to be managed by another piece of code (
    const uncontrolledValue = element.attributes.getNamedItem('data-uncontrolled-value')?.value ?? '';

    if (uncontrolledValue === 'true') {
      return;
    }

    if (inputType === InputType.CHECKBOX) {
      const inputValue = element.attributes.getNamedItem('value')?.value ?? '';

      // see comment at top of file as to why explicit casting is happening
      (element as HTMLInputElement).checked = storedValue.includes(inputValue);

      return;
    }

    if (inputType === InputType.RADIO) {
      const inputValue = element.attributes.getNamedItem('value')?.value ?? '';

      // see comment at top of file as to why explicit casting is happening
      (element as HTMLInputElement).checked = storedValue === inputValue;

      return;
    }

    // see comment at top of file as to why explicit casting is happening
    (element as HTMLInputElement).value = storedValue;
  };

  const checkForInputElements = (mutation: MutationRecord) => {
    Array.from(mutation.addedNodes).some((node) => {
      const formInputElements = domUtils.getFormInputElementsRecursive(node as Element);

      for (const inputElement of formInputElements) {
        assignFormInputEventHandlers(inputElement);
        applyValueFromStore(inputElement);
      }
    });
  };

  const domMutationHandler = (mutationList: MutationRecord[]) => {
    for (const mutation of mutationList) {
      checkForInputElements(mutation);
    }
  };

  const form = (element: HTMLFormElement) => {
    const inputElements = element.querySelectorAll('input');
    const selectElements = element.querySelectorAll('select');

    for (const inputElement of inputElements) {
      assignFormInputEventHandlers(inputElement);
      applyValueFromStore(inputElement);
    }

    for (const selectElement of selectElements) {
      assignFormInputEventHandlers(selectElement);
      applyValueFromStore(selectElement);
    }

    setFormElement(element);

    element.addEventListener('submit', onSubmitForm);

    const domObserver = new MutationObserver(domMutationHandler);

    domObserver.observe(element, { childList: true, subtree: true });
  };

  const addArrayField = (name: keyof TFormData, value: Record<string, unknown> = {}) => {
    setData((oldValue) => {
      const newValue = { ...oldValue };

      if (!newValue[name]) {
        // @ts-expect-error see comment at top of file
        newValue[name] = [];
      }

      // see comment at top of file as to why explicit casting is happening
      (newValue[name] as unknown[]).push(value);

      return newValue;
    });

    triggerValueChanged(name as string, get(data(), name as string), { isTouched: true });
  };

  const removeArrayField = (name: keyof TFormData, removeIndex: number) => {
    setData((oldValue) => {
      return {
        ...oldValue,
        // see comment at top of file as to why explicit casting is happening
        [name]: (oldValue[name] as unknown[]).filter((value, index) => removeIndex !== index),
      };
    });

    triggerValueChanged(name as string, get(data(), name as string), { isTouched: true });
  };

  const setValue: FormSetValue<TFormData> = (name: keyof TFormData, value: unknown) => {
    setData((oldValue) => {
      const newValue = { ...oldValue };

      newValue[name] = value as TFormData[keyof TFormData];

      return newValue;
    });

    triggerValueChanged(name as string, value, { isTouched: true });

    // see comment at top of file as to why explicit casting is happening
    // we do all version to properly support checkboxes and radios that can have the same name
    const inputElements = formElement()?.querySelectorAll(`[name="${name as string}"]`);

    if (!inputElements) {
      return;
    }

    for (const inputElement of inputElements) {
      applyValueFromStore(inputElement);
    }
  };

  const resetHtmlElements = () => {
    // reset the html elements
    const inputElements = formElement()?.querySelectorAll('input');
    const selectElements = formElement()?.querySelectorAll('select');

    for (const inputElement of inputElements ?? []) {
      applyValueFromStore(inputElement);
    }

    for (const selectElement of selectElements ?? []) {
      applyValueFromStore(selectElement);
    }
  };

  const reset = () => {
    // reset the internal data
    setData(options.initialValues ?? {});
    setErrors({});
    setTouchedFields([]);

    if (options.onReset) {
      options.onReset();
    }

    resetHtmlElements();
  };

  const clear = () => {
    // clear the internal data
    setData({});
    setErrors({});
    setTouchedFields([]);

    if (options.onClear) {
      options.onClear();
    }

    resetHtmlElements();
  };

  return {
    form,
    data,
    addArrayField,
    removeArrayField,
    setValue,
    errors,
    clear,
    reset,
    setSchema,
    isTouched,
    touchedFields,
  };
};

export const formStoreUtils = {
  createForm,
};
