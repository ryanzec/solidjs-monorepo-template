import { createSignal } from 'solid-js';

export type AutoCompleteOptionValue = string | number;

// we use the as the default for extending the auto complete option to allow any data
export interface AutoCompleteExtraData {
  // to make this be easier to be used as a generic type, we need to allow any extra data for auto complete options
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type AutoCompleteOption<TData = AutoCompleteExtraData> = {
  display: string;
  value: AutoCompleteOptionValue;
} & TData;

interface CreateProps<TData> {
  defaultValue: AutoCompleteOption<TData>[];
}

const createAutoComplete = <TData = AutoCompleteExtraData>(options?: CreateProps<TData>) => {
  const [selected, setSelected] = createSignal<AutoCompleteOption<TData>[]>(options?.defaultValue ?? []);

  return {
    selected,
    setSelected,
  };
};

const simpleFilter = <TData>(
  options: AutoCompleteOption<TData>[],
  inputValue = '',
  excludeValues: AutoCompleteOptionValue[] = [],
) => {
  if (!inputValue && excludeValues.length === 0) {
    return options;
  }

  return options.filter((option) => {
    return !excludeValues.includes(option.value) && option.display.toLowerCase().includes(inputValue.toLowerCase());
  });
};

export const autoCompleteUtils = {
  createAutoComplete,
  simpleFilter,
};
