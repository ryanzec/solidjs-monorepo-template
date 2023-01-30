//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// there are numerous locations where we are doing explicit casting and such which related to:
//
// - the fact that is seems like Node element are typed in a way they should not be
// - to account for the fact that we are modifying data without really knowing the type
//
// while there might be better way to handle this, this is the best solution I know at the time of writing this
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import get from 'get-value';
import set from 'set-value';
import { createSignal } from 'solid-js';
import * as zod from 'zod';

const inputNodeNames = ['INPUT', 'SELECT', 'TEXTAREA'];

enum InputType {
  NONE = 'none',
  TEXT = 'text',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  SELECT = 'select',
  TEXTAREA = 'textarea',
}

interface CreateFormParams<TFormData extends object> {
  onSubmit?: (data: Partial<TFormData>) => void;
  initialValues?: Partial<TFormData>;
  // seems like any is needed to support the zod schema type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema?: zod.ZodType<TFormData, any, any>;
}

const createForm = <TFormData extends object>(params: CreateFormParams<TFormData> = {}) => {
  const [errors, setErrors] = createSignal();
  // see comment at top of file as to why explicit casting is happening
  const [data, setData] = createSignal<TFormData>((params.initialValues ?? {}) as TFormData);
  const [formElement, setFormElement] = createSignal<Element>();

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
  };

  const onCheckboxChange = (event: Event) => {
    // see comment at top of file as to why explicit casting is happening
    const target = event.target as HTMLInputElement;
    const name = target.name;
    const value = target.value;
    const checked = target.checked;
    let newValue = get(data(), name);

    if (!Array.isArray(newValue)) {
      newValue = [];
    }

    if (checked) {
      newValue.push(value);
    } else {
      newValue = newValue.filter((currentValue: unknown) => currentValue !== value);
    }

    setData((oldValue) => {
      const newValue = { ...oldValue };

      set(newValue, name, newValue);

      return newValue;
    });
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
  };

  const onSubmitForm = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!params.onSubmit) {
      return;
    }

    const values = data();

    if (params.schema) {
      const validationResults = params.schema.safeParse(values);

      if (!validationResults.success) {
        console.log(validationResults.error.format());
      }
    }

    params.onSubmit(values);
  };

  const isFormInputElement = (element?: Element) => {
    if (!element) {
      return false;
    }

    return inputNodeNames.includes(element.nodeName);
  };

  const isElement = (element?: Element) => {
    return element?.nodeType === Node.ELEMENT_NODE;
  };

  const getInputType = (element?: Element) => {
    if (!element) {
      return InputType.NONE;
    }

    if (element.nodeName === 'SELECT') {
      return InputType.SELECT;
    }

    if (element.nodeName === 'TEXTAREA') {
      return InputType.TEXTAREA;
    }

    const inputType = element.attributes.getNamedItem('type')?.value;

    switch (inputType) {
      case 'checkbox':
        return InputType.CHECKBOX;

      case 'radio':
        return InputType.RADIO;
    }

    return InputType.TEXT;
  };

  const getFormInputElementsRecursive = (element: Element) => {
    const formInputs: Element[] = [];
    const elementsToCheck: Element[] = [element];
    let currentElement: Element | undefined;
    let elementsProcessed = 0;

    while (elementsToCheck.length > 0) {
      elementsProcessed++;
      currentElement = elementsToCheck.shift();

      if (!currentElement) {
        continue;
      }

      // this while recursively process all children elements
      for (const child of currentElement.children) {
        elementsToCheck.push(child);
      }

      if (!isFormInputElement(currentElement)) {
        continue;
      }

      formInputs.push(currentElement);
    }

    return formInputs;
  };

  const assignFormInputEventHandlers = (element: Element) => {
    const inputType = getInputType(element);

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
  };

  const applyValueFromStore = (element: Element) => {
    const inputType = getInputType(element);
    const inputName = element.attributes.getNamedItem('name')?.value ?? '';
    const storedValue = get(data(), inputName);

    if (!storedValue) {
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
      const formInputElements = getFormInputElementsRecursive(node as Element);

      for (const inputElement of formInputElements) {
        assignFormInputEventHandlers(inputElement);
        applyValueFromStore(inputElement);
      }
    });
  };

  const domMutationHandler = (mutationList: MutationRecord[], observer: MutationObserver) => {
    // console.profile('domMutationHandler');

    for (const mutation of mutationList) {
      checkForInputElements(mutation);
    }

    // console.profileEnd();
  };

  const form = (element: HTMLFormElement) => {
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
  };

  const removeArrayField = (name: keyof TFormData, removeIndex: number) => {
    setData((oldValue) => {
      return {
        ...oldValue,
        // see comment at top of file as to why explicit casting is happening
        [name]: (oldValue[name] as unknown[]).filter((value, index) => removeIndex !== index),
      };
    });
  };

  const setValue = (name: keyof TFormData, value: TFormData[keyof TFormData]) => {
    setData((oldValue) => {
      const newValue = { ...oldValue };

      newValue[name] = value;

      return newValue;
    });

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

  return { form, data, addArrayField, removeArrayField, setValue };
};

export const formUtils = {
  createForm,
};
