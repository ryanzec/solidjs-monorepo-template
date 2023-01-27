import { createForm } from '@felte/solid';
import { validator } from '@felte/validator-zod';
import classnames from 'classnames';
import { createEffect, createSignal, Show } from 'solid-js';
import * as zod from 'zod';

import styles from '$/components/auto-complete/auto-complete.module.css';
import AutoComplete, { AutoCompleteOption, autoCompleteUtils } from '$/components/auto-complete/index';
import { SelectableOptionProps } from '$/components/auto-complete/selectable-option';
import { SelectedOptionProps } from '$/components/auto-complete/selected-option';
import Button from '$/components/button/button';
import ValidationMessage from '$/components/validation-message';
import { zodUtils } from '$/utils/zod';

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
}

const BasicExample = (props: ExampleProps) => {
  const [options] = createSignal<AutoCompleteOption<CustomExtraData>[]>([
    { display: 'test1', value: 11 },
    { display: 'test2', value: 22 },
    { display: 'tes3', value: 33 },
    { display: 'tes4', value: 44 },
  ]);
  const autoComplete = autoCompleteUtils.createAutoComplete({
    defaultValue:
      props.selectedOptionIndex !== undefined && props.selectedOptionIndex >= 0
        ? [options()[props.selectedOptionIndex]]
        : [],
  });

  const setSelected = (options: AutoCompleteOption<CustomExtraData>[]) => {
    autoComplete.setSelected(options);

    if (props.onSelected) {
      props.onSelected(options);
    }
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
        filterOptions={autoCompleteUtils.simpleFilter}
        setSelected={setSelected}
        selected={autoComplete.selected()}
        placeholder={props.placeholder}
        getOptionsAsync={props.useAsync ? getOptionsAsync : undefined}
      />
      <Button data-id="reset-selected-button" onclick={onResetSelected}>
        reset selected
      </Button>
      <Show when={autoComplete.selected().length > 0}>
        <div data-id="check-selected-auto-complete-value">
          selected item value: {autoComplete.selected()[0].display}
        </div>
      </Show>
    </>
  );
};

const MultiSelectExample = (props: ExampleProps) => {
  const [options] = createSignal<AutoCompleteOption<CustomExtraData>[]>([
    { display: 'test1', value: 11, meta: { extra: 'test' } },
    { display: 'test2', value: 22 },
    { display: 'tes3', value: 33 },
    { display: 'tes4', value: 44 },
  ]);
  const autoComplete = autoCompleteUtils.createAutoComplete({
    defaultValue:
      props.selectedOptionIndex !== undefined && props.selectedOptionIndex >= 0
        ? [options()[props.selectedOptionIndex]]
        : [],
  });

  const onDeleteOption = (deletedOption: AutoCompleteOption<CustomExtraData>) => {
    console.log(JSON.stringify(deletedOption));
  };

  const setSelected = (options: AutoCompleteOption<CustomExtraData>[]) => {
    autoComplete.setSelected(options);

    if (props.onSelected) {
      props.onSelected(options);
    }
  };

  return (
    <>
      <AutoComplete
        forceSelection={props.forceSelection}
        autoShowOptions={props.autoShowOptions}
        options={options()}
        filterOptions={autoCompleteUtils.simpleFilter}
        setSelected={setSelected}
        selected={autoComplete.selected()}
        onDeleteOption={onDeleteOption}
        placeholder={props.placeholder}
        getOptionsAsync={props.useAsync ? getOptionsAsync : undefined}
        isMulti
      />
    </>
  );
};

const CustomSelectedOption = (props: SelectedOptionProps<CustomExtraData>) => {
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

const CustomSelectableOption = (props: SelectableOptionProps<CustomExtraData>) => {
  return (
    <div
      data-id={`option${props.isFocusedOption(props.optionIndex) ? ' highlighted-option' : ''}`}
      class={classnames(styles.selectableOption, {
        [styles.highlightedOption]: props.isFocusedOption(props.optionIndex),
      })}
      onmouseenter={() => props.onMouseEnterOption(props.optionIndex)}
      onmouseleave={() => props.onMouseLeaveOption()}
      onmousedown={() => props.onMouseDownOption(props.option)}
      role="button"
      tabindex={-1}
    >
      --{props.option.display}({props.option.meta?.extra})--
    </div>
  );
};

export const Default = () => {
  const [useCustomSelectable, setUseCustomSelectable] = createSignal(false);
  const [useCustomSelected, setUseCustomSelected] = createSignal(false);
  const test1AutoComplete = autoCompleteUtils.createAutoComplete();

  const toggleUseCustomSelectable = () => {
    setUseCustomSelectable(!useCustomSelectable());
  };

  const toggleUseCustomSelected = () => {
    setUseCustomSelected(!useCustomSelected());
  };

  return (
    <>
      <div>Auto Complete 1</div>
      <AutoComplete
        selected={test1AutoComplete.selected()}
        setSelected={test1AutoComplete.setSelected}
        options={[
          {
            display: 'Option 1',
            value: 1,
            meta: {
              extra: 'data',
            },
          },
          {
            display: 'Option 2',
            value: 2,
          },
          {
            display: 'Option 3',
            value: 3,
          },
        ]}
        autoShowOptions
        filterOptions={autoCompleteUtils.simpleFilter}
        isMulti
        selectedComponent={useCustomSelected() ? CustomSelectedOption : undefined}
        selectableComponent={useCustomSelectable() ? CustomSelectableOption : undefined}
      />
      <Button onclick={toggleUseCustomSelectable}>
        Toggle Custom Selectable Component (Current: {JSON.stringify(useCustomSelectable())})
      </Button>
      <br />
      <Button onclick={toggleUseCustomSelected}>
        Toggle Custom Selected Component (Current: {JSON.stringify(useCustomSelected())})
      </Button>
      <br />
      <Show when={test1AutoComplete.selected()}>
        selected value: {JSON.stringify(test1AutoComplete.selected(), null, 2)}
      </Show>
    </>
  );
};

export const Single = () => {
  return <BasicExample />;
};

export const Multi = () => {
  return <MultiSelectExample />;
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
  const { form, setFields, errors } = createForm<zod.infer<typeof formDataSchema>>({
    extend: validator({ schema: formDataSchema }),
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

    setFields('autoComplete', value);
  };

  return (
    <form use:form>
      <BasicExample onSelected={onSelected} />
      <ValidationMessage messages={errors().autoComplete} />
      <button type="submit">Submit</button>
    </form>
  );
};
