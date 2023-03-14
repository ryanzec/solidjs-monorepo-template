import classnames from 'classnames';
import { Accessor, For, mergeProps, Show, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import SelectableOption from '$/components/auto-complete/selectable-option';
import SelectedOption from '$/components/auto-complete/selected-option';
import {
  AsyncOptionsState,
  AutoCompleteExtraData,
  AutoCompleteOption,
  AutoCompleteProps,
  autoCompleteUtils,
} from '$/components/auto-complete/utils';
import Button from '$/components/button/button';
import { ButtonVariant } from '$/components/button/utils';
import Icon from '$/components/icon';
import Input from '$/components/input';
import { InputVariant } from '$/components/input/utils';

import styles from './auto-complete.module.css';

const AutoComplete = <TData extends AutoCompleteExtraData>(passedProps: AutoCompleteProps<TData>) => {
  const [props, restOfProps] = splitProps(
    mergeProps(
      { placeholder: 'Select...', autoShowOptions: false, forceSelection: true, isMulti: false, asyncDelay: 350 },
      passedProps,
    ),
    [
      'selected',
      'setSelected',
      'placeholder',
      'options',
      'autoShowOptions',
      'forceSelection',
      'filterOptions',
      'isMulti',
      'getOptionsAsync',
      'asyncDelay',
      'asyncThreshold',
      'selectableComponent',
      'selectedComponent',
      'onDeleteOption',
      'removeOnDuplicateSingleSelect',

      // native html props that need to be applied to the input element, not the auto complete wrapper
      'id',
      'name',
    ],
  );

  const autoCompleteStore = autoCompleteUtils.createAutoComplete(props);

  return (
    <div data-id="auto-complete" class={styles.autoComplete} {...restOfProps}>
      <div class={styles.inputContainer}>
        <Input
          {...autoCompleteStore.getInputProps()}
          variant={InputVariant.TRANSPARENT}
          type="text"
          data-uncontrolled-value="true"
          class={styles.input}
        />
        <Button
          data-id="input-icon-indicator"
          class={styles.inputIconIndicator}
          variant={ButtonVariant.UNSTYLED}
          onClick={() => {
            if (autoCompleteStore.inputHasClearableValue()) {
              autoCompleteStore.clearSelection();
            }

            autoCompleteStore.store.inputRef?.focus();
          }}
        >
          <Show when={!autoCompleteStore.inputHasClearableValue()} fallback={<Icon.HeroXMark />}>
            <Icon.HeroChevronDown />
          </Show>
        </Button>
      </div>
      <div data-id="options" class={classnames(styles.list, { [styles.openedList]: autoCompleteStore.store.isOpen })}>
        <Show when={autoCompleteStore.store.isOpen && autoCompleteStore.asyncOptionsAreLoading()}>
          <li data-id="async-options-loading" class={styles.loadingIndicator}>
            Loading...
          </li>
        </Show>
        <Show
          when={
            autoCompleteStore.store.isOpen &&
            autoCompleteStore.store.asyncOptionsState === AsyncOptionsState.BEFORE_THRESHOLD
          }
        >
          <li data-id="async-options-before-threshold" class={styles.loadingIndicator}>
            Loading...
          </li>
        </Show>
        <Show when={autoCompleteStore.store.isOpen && autoCompleteStore.showOptions()}>
          <For
            each={autoCompleteStore.store.displayOptions}
            fallback={
              <Show when={!autoCompleteStore.asyncOptionsAreLoading()}>
                <div data-id="`option no-options-found" class={classnames(styles.selectableOption)}>
                  No Options Found
                </div>
              </Show>
            }
          >
            {(option, optionIndex) => {
              return (
                <Dynamic
                  component={props.selectableComponent}
                  {...autoCompleteStore.getSelectionOptionProps()}
                  option={option}
                  optionIndex={optionIndex()}
                />
              );
            }}
          </For>
        </Show>
      </div>
      <Show when={props.isMulti && props.selected.length > 0 && !!props.selectedComponent}>
        <div data-id="selected-options">
          <For each={props.selected}>
            {(option: AutoCompleteOption<TData>, optionIndex: Accessor<number>) => {
              return (
                <Dynamic
                  component={props.selectedComponent}
                  {...autoCompleteStore.getSelectedOptionProps()}
                  option={option}
                  optionIndex={optionIndex()}
                />
              );
            }}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default AutoComplete;
