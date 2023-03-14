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
  onSubmit?: (data: Partial<TFormData>) => void;
  // since this is a generic system, not sure what else can be done besides using any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onValueChanged?: (name: keyof TFormData, value: any) => void;
  onClear?: () => void;
  onReset?: () => void;
  initialValues?: Partial<TFormData>;
  // seems like any is needed to support the zod schema type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema?: zod.ZodType<TFormData, any, any>;
}

const createForm = <TFormData extends object>(options: CreateFormOptions<TFormData> = {}) => {
  const [errors, setErrors] = createSignal<FormErrorsData<TFormData>>({});
  // see comment at top of file as to why explicit casting is happening
  const [data, setData] = createSignal<Partial<TFormData>>(options.initialValues ?? {});
  const [formElement, setFormElement] = createSignal<Element>();

  // forms are dynamic so allowing any value here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const triggerValueChanged = (name: string, value: any) => {
    if (!options.onValueChanged) {
      return;
    }

    options.onValueChanged(name as keyof TFormData, value);
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

    // @todo(refactor) might want to make this configurable if doing this on every change becomes a problem in
    // @todo(refactor) certain cases
    triggerValueChanged(name, get(data(), name));
  };

  const onTextChange = (event: Event) => {
    // see comment at top of file as to why explicit casting is happening
    const target = event.target as HTMLInputElement;
    const name = target.name;

    triggerValueChanged(name, get(data(), name));
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

    triggerValueChanged(name, get(data(), name));
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

    triggerValueChanged(name, get(data(), name));
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

    triggerValueChanged(name, get(data(), name));
  };

  const onSubmitForm = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!options.onSubmit) {
      return;
    }

    const values = data();

    if (options.schema) {
      const validationResults = options.schema.safeParse(values);

      if (!validationResults.success) {
        const getErrors = (formattedErrors: { _errors: string[] }) => {
          console.log(formattedErrors);
          const errorKeys = Object.keys(formattedErrors);
          const errors = {};

          errorKeys.forEach((errorKey) => {
            // this seems to always be part of the result of zod formatted validation but is not useful is our case
            // as best  I can tell
            if (errorKey === '_errors') {
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

                currentFieldErrors[currentFieldKey] = getErrors(currentField[currentFieldKey]);
              });
            }

            if (currentField._errors?.length > 0) {
              currentFieldErrors.errors = currentField._errors;
            }

            // @ts-expect-error see comment at top of file
            errors[errorKey] = currentFieldErrors;
          });

          return errors;
        };

        const formattedErrors = validationResults.error.format();

        setErrors(getErrors(formattedErrors));

        return;
      }

      setErrors({});
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

    triggerValueChanged(name as string, get(data(), name as string));
  };

  const removeArrayField = (name: keyof TFormData, removeIndex: number) => {
    setData((oldValue) => {
      return {
        ...oldValue,
        // see comment at top of file as to why explicit casting is happening
        [name]: (oldValue[name] as unknown[]).filter((value, index) => removeIndex !== index),
      };
    });

    triggerValueChanged(name as string, get(data(), name as string));
  };

  const setValue: FormSetValue<TFormData> = (name: keyof TFormData, value: unknown) => {
    setData((oldValue) => {
      const newValue = { ...oldValue };

      newValue[name] = value as TFormData[keyof TFormData];

      return newValue;
    });

    triggerValueChanged(name as string, value);

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

    if (options.onReset) {
      options.onReset();
    }

    resetHtmlElements();
  };

  const clear = () => {
    // clear the internal data
    setData({});
    setErrors({});

    if (options.onClear) {
      options.onClear();
    }

    resetHtmlElements();
  };

  return { form, data, addArrayField, removeArrayField, setValue, errors, clear, reset };
};

export const formStoreUtils = {
  createForm,
};
