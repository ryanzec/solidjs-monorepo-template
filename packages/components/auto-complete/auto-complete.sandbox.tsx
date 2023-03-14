import classnames from 'classnames';
import { createSignal, For, Show } from 'solid-js';
import * as zod from 'zod';

import styles from '$/components/auto-complete/auto-complete.module.css';
import AutoComplete, { AutoCompleteOption, autoCompleteUtils } from '$/components/auto-complete/index';
import Button from '$/components/button/button';
import ValidationMessage from '$/components/validation-message';
import { formStoreUtils } from '$/stores/form-store';
import { zodUtils } from '$/utils/zod';

import { AutoCompleteProps, AutoCompleteSelectableOptionProps, AutoCompleteSelectedOptionProps } from './utils';

export default {
  title: 'Packages/Components/AutoComplete',
};

type CustomExtraData = {
  meta?: {
    extra: string;
  };
};

const getOptionsAsync = async (inputValue?: string): Promise<AutoCompleteOption<CustomExtraData>[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    { display: `${inputValue} 1`, value: 11 },
    { display: `${inputValue} 2`, value: 22 },
    { display: `${inputValue} 3`, value: 33 },
    { display: `${inputValue} 4`, value: 44 },
  ];
};

interface ExampleProps {
  selectedOptionIndex?: number;
  autoShowOptions?: boolean;
  forceSelection?: boolean;
  placeholder?: string;
  useAsync?: boolean;
  onSelected?: (options: AutoCompleteOption<CustomExtraData>[]) => void;
  filterOptions?: AutoCompleteProps<CustomExtraData>['filterOptions'];
  selectedComponent?: AutoCompleteProps<CustomExtraData>['selectedComponent'] | null;
  selectableComponent?: AutoCompleteProps<CustomExtraData>['selectableComponent'];
  removeOnDuplicateSingleSelect?: boolean;
}

const getSelectedComponent = (selectedComponent?: AutoCompleteProps<CustomExtraData>['selectedComponent'] | null) => {
  if (selectedComponent === undefined) {
    return AutoComplete.SelectedOption;
  }

  return selectedComponent === null ? undefined : selectedComponent;
};

const BasicExample = (props: ExampleProps) => {
  const [options] = createSignal<AutoCompleteOption<CustomExtraData>[]>(
    props.useAsync
      ? []
      : [
          { display: 'test1', value: 11 },
          { display: 'test2', value: 22 },
          { display: 'tes3', value: 33 },
          { display: 'tes4', value: 44 },
        ],
  );
  const autoCompleteStore = autoCompleteUtils.createAutoCompleteValue({
    defaultValue:
      props.selectedOptionIndex !== undefined && props.selectedOptionIndex >= 0
        ? [options()[props.selectedOptionIndex]]
        : [],
  });

  const setSelected = (options: AutoCompleteOption<CustomExtraData>[]) => {
    autoCompleteStore.setSelected(options);

    if (props.onSelected) {
      props.onSelected(options);
    }
  };

  const onSetSelected = () => {
    setSelected([options()[3]]);
  };

  const onResetSelected = () => {
    setSelected([]);
  };

  return (
    <>
      <AutoComplete
        forceSelection={props.forceSelection}
        autoShowOptions={props.autoShowOptions}
        options={options()}
        filterOptions={props.filterOptions ?? autoCompleteUtils.excludeSelectedFilter}
        setSelected={setSelected}
        selected={autoCompleteStore.selected()}
        placeholder={props.placeholder}
        getOptionsAsync={props.useAsync ? getOptionsAsync : undefined}
        name="autoComplete"
        selectedComponent={getSelectedComponent(props.selectedComponent)}
        selectableComponent={props.selectableComponent ?? AutoComplete.SelectableOption}
        removeOnDuplicateSingleSelect={!!props.removeOnDuplicateSingleSelect}
      />
      <Button data-id="reset-selected-button" onClick={onResetSelected}>
        reset selected
      </Button>
      <Button data-id="set-selected-button" onClick={onSetSelected}>
        manually set selected
      </Button>
      <Show when={autoCompleteStore.selected().length > 0}>
        <div data-id="check-selected-auto-complete-value">
          selected item value: {autoCompleteStore.selected()[0].display}
        </div>
      </Show>
    </>
  );
};

const MultiSelectExample = (props: ExampleProps) => {
  const [options] = createSignal<AutoCompleteOption<CustomExtraData>[]>(
    props.useAsync
      ? []
      : [
          { display: 'test1', value: 11, meta: { extra: 'test' } },
          { display: 'test2', value: 22 },
          { display: 'tes3', value: 33 },
          { display: 'tes4', value: 44 },
        ],
  );
  const autoCompleteStore = autoCompleteUtils.createAutoCompleteValue({
    defaultValue:
      props.selectedOptionIndex !== undefined && props.selectedOptionIndex >= 0
        ? [options()[props.selectedOptionIndex]]
        : [],
  });

  const onDeleteOption = (deletedOption: AutoCompleteOption<CustomExtraData>) => {
    console.log(JSON.stringify(deletedOption));
  };

  const setSelected = (options: AutoCompleteOption<CustomExtraData>[]) => {
    autoCompleteStore.setSelected(options);

    if (props.onSelected) {
      props.onSelected(options);
    }
  };

  const onSetSelected = () => {
    setSelected([options()[3]]);
  };

  const onResetSelected = () => {
    setSelected([]);
  };

  return (
    <>
      <AutoComplete
        forceSelection={props.forceSelection}
        autoShowOptions={props.autoShowOptions}
        options={options()}
        filterOptions={props.filterOptions ?? autoCompleteUtils.excludeSelectedFilter}
        setSelected={setSelected}
        selected={autoCompleteStore.selected()}
        onDeleteOption={onDeleteOption}
        placeholder={props.placeholder}
        getOptionsAsync={props.useAsync ? getOptionsAsync : undefined}
        isMulti
        name="autoComplete"
        selectedComponent={getSelectedComponent(props.selectedComponent)}
        selectableComponent={props.selectableComponent ?? AutoComplete.SelectableOption}
        removeOnDuplicateSingleSelect={!!props.removeOnDuplicateSingleSelect}
      />
      <Button data-id="reset-selected-button" onClick={onResetSelected}>
        reset selected
      </Button>
      <Button data-id="set-selected-button" onClick={onSetSelected}>
        manually set selected
      </Button>
      <Show when={autoCompleteStore.selected().length > 0}>
        <hr />
        <For each={autoCompleteStore.selected()}>
          {(selected) => {
            return (
              <div data-id="manual-selected-options">
                {selected.display}({selected.value})
              </div>
            );
          }}
        </For>
      </Show>
    </>
  );
};

const CustomSelectedOption = (props: AutoCompleteSelectedOptionProps<CustomExtraData>) => {
  return (
    <span data-id="selected-option" class={styles.selectedOption}>
      {props.option.display}
      <Button
        data-id="delete-indicator"
        class={styles.removeSelectedOption}
        onclick={() => props.removeValue(props.optionIndex)}
      >
        Z
      </Button>
    </span>
  );
};

const CustomSelectableOption = (props: AutoCompleteSelectableOptionProps<CustomExtraData>) => {
  return (
    <div
      data-id={`option${props.isFocusedOption(props.optionIndex) ? ' highlighted-option' : ''}`}
      class={classnames(styles.selectableOption, {
        [styles.highlightedOption]: props.isFocusedOption(props.optionIndex),
      })}
      onMouseEnter={() => props.onMouseEnterOption(props.optionIndex)}
      onMouseLeave={() => props.onMouseLeaveOption()}
      onMouseDown={() => props.onMouseDownOption(props.option)}
      role="button"
      tabIndex={-1}
    >
      --{props.option.display}({props.option.meta?.extra})--
    </div>
  );
};

export const Single = () => {
  return <BasicExample />;
};

export const Multi = () => {
  return <MultiSelectExample />;
};

export const SingleFormattedSelectables = () => {
  return (
    <BasicExample
      // selectableComponent={AutoComplete.FormattedSelectableOption}
      filterOptions={autoCompleteUtils.simpleFilter}
      // selectedComponent={null}
    />
  );
};

export const MultiFormattedSelectables = () => {
  return (
    <MultiSelectExample
      // selectableComponent={AutoComplete.FormattedSelectableOption}
      filterOptions={autoCompleteUtils.simpleFilter}
      // selectedComponent={null}
    />
  );
};

export const SingleFormattedSelectablesRemoveDuplicateSelect = () => {
  return (
    <BasicExample
      // selectableComponent={AutoComplete.FormattedSelectableOption}
      filterOptions={autoCompleteUtils.simpleFilter}
      // selectedComponent={null}
      removeOnDuplicateSingleSelect
    />
  );
};

export const SinglePreselected = () => {
  return <BasicExample selectedOptionIndex={0} />;
};

export const MultiPreselected = () => {
  return <MultiSelectExample selectedOptionIndex={0} />;
};

export const SingleAutoShowOptions = () => {
  return <BasicExample autoShowOptions />;
};

export const MultiAutoShowOptions = () => {
  return <MultiSelectExample autoShowOptions />;
};

export const SingleNoForceSelection = () => {
  return <BasicExample forceSelection={false} />;
};

export const MultiNoForceSelection = () => {
  return <MultiSelectExample forceSelection={false} />;
};

export const SinglePlaceholder = () => {
  return <BasicExample placeholder="placeholder" />;
};

export const MultiPlaceholder = () => {
  return <MultiSelectExample placeholder="placeholder" />;
};

export const SingleAsync = () => {
  return <BasicExample useAsync />;
};

export const MultiAsync = () => {
  return <MultiSelectExample useAsync />;
};

interface FormData {
  autoComplete: number[];
}

const formDataSchema = zodUtils.schemaForType<FormData>()(
  zod.object({
    autoComplete: zod.number().array().min(1, 'must select at least 1 value'),
  }),
);

export const SingleInForm = () => {
  const { form, setValue, errors } = formStoreUtils.createForm({
    schema: formDataSchema,
    initialValues: {
      autoComplete: [],
    },
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const onSelected = (options: AutoCompleteOption<CustomExtraData>[]) => {
    // cast needed since auto complete values can be a number of types
    const value = options.map((option) => option.value) as number[];

    setValue('autoComplete', value);
  };

  return (
    <form use:form>
      <BasicExample onSelected={onSelected} />
      <ValidationMessage messages={errors().autoComplete?.errors} />
      <button type="submit">Submit</button>
    </form>
  );
};

export const MultiInForm = () => {
  const { form, setValue, errors } = formStoreUtils.createForm({
    schema: formDataSchema,
    initialValues: {
      autoComplete: [],
    },
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const onSelected = (options: AutoCompleteOption<CustomExtraData>[]) => {
    // cast needed since auto complete values can be a number of types
    const value = options.map((option) => option.value) as number[];

    setValue('autoComplete', value);
  };

  return (
    <form use:form>
      <MultiSelectExample onSelected={onSelected} />
      <ValidationMessage messages={errors().autoComplete?.errors} />
      <button type="submit">Submit</button>
    </form>
  );
};

export const SingleInFormAutoShowOptions = () => {
  const { form, setValue, errors } = formStoreUtils.createForm({
    schema: formDataSchema,
    initialValues: {
      autoComplete: [],
    },
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const onSelected = (options: AutoCompleteOption<CustomExtraData>[]) => {
    // cast needed since auto complete values can be a number of types
    const value = options.map((option) => option.value) as number[];

    setValue('autoComplete', value);
  };

  return (
    <form use:form>
      <BasicExample onSelected={onSelected} autoShowOptions />
      <ValidationMessage messages={errors().autoComplete?.errors} />
      <button type="submit">Submit</button>
    </form>
  );
};

export const MultiInFormAutoShowOptions = () => {
  const { form, setValue, errors } = formStoreUtils.createForm({
    schema: formDataSchema,
    initialValues: {
      autoComplete: [],
    },
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const onSelected = (options: AutoCompleteOption<CustomExtraData>[]) => {
    // cast needed since auto complete values can be a number of types
    const value = options.map((option) => option.value) as number[];

    setValue('autoComplete', value);
  };

  return (
    <form use:form>
      <MultiSelectExample onSelected={onSelected} autoShowOptions />
      <ValidationMessage messages={errors().autoComplete?.errors} />
      <button type="submit">Submit</button>
    </form>
  );
};
