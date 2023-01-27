import { debounce } from '@solid-primitives/scheduled';
import classnames from 'classnames';
import { Accessor, createEffect, For, JSX, mergeProps, onCleanup, Show } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { Dynamic } from 'solid-js/web';

import SelectableOption, { SelectableOptionProps } from '$/components/auto-complete/selectable-option';
import SelectedOption, { SelectedOptionProps } from '$/components/auto-complete/selected-option';
import { AutoCompleteExtraData, AutoCompleteOption, AutoCompleteOptionValue } from '$/components/auto-complete/utils';
import Input from '$/components/input';
import { Key } from '$/types/generic';

import styles from './auto-complete.module.css';

enum AsyncOptionsState {
  // nothing is happening
  NOT_APPLICABLE = 'not-applicable',

  // wait for the debounced request to be executed
  DEBOUNCED = 'debounced',

  // async request in progress
  FETCHING = 'fetching',

  // async request has successful completed
  SUCCESSFUL = 'successful',

  // async request failed to load options
  // @todo handle this properly in the component
  ERROR = 'error',
}

interface AutoCompleteProps<TData extends AutoCompleteExtraData> extends JSX.HTMLAttributes<HTMLDivElement> {
  selected: AutoCompleteOption<TData>[];
  setSelected: (option: AutoCompleteOption<TData>[]) => void;
  placeholder?: string;
  options: AutoCompleteOption<TData>[];
  autoShowOptions?: boolean;
  forceSelection?: boolean;
  filterOptions?: (
    options: AutoCompleteOption<TData>[],
    inputValue?: string,
    excludeValues?: AutoCompleteOptionValue[],
  ) => AutoCompleteOption<TData>[];
  isMulti?: boolean;
  getOptionsAsync?: (inputValue?: string) => Promise<AutoCompleteOption<TData>[]>;
  asyncDelay?: number;
  selectedComponent?: (props: SelectedOptionProps<TData>) => JSX.Element;
  selectableComponent?: (props: SelectableOptionProps<TData>) => JSX.Element;
  onDeleteOption?: (deletedOption: AutoCompleteOption<TData>) => void;
}

interface AutoCompleteStore<TData extends AutoCompleteExtraData> {
  disabled: boolean;
  inputValue: string;
  isOpen: boolean;
  displayOptions: AutoCompleteOption<TData>[];
  focusedOptionIndex?: number;
  focusedOption?: AutoCompleteOption<TData>;
  inputRef?: HTMLInputElement;
  keepFocusOnBlur: boolean;
  isLoadingAsyncOptions: boolean;
  asyncOptionsState: AsyncOptionsState;
}

const getAutoCompleteStoreDefaults = <TData extends AutoCompleteExtraData>() => {
  return {
    disabled: false,
    inputValue: '',
    isOpen: false,
    displayOptions: [],
    keepFocusOnBlur: false,
    isLoadingAsyncOptions: false,
    asyncOptionsState: AsyncOptionsState.NOT_APPLICABLE,
  } as AutoCompleteStore<TData>;
};

const AutoComplete = <TData extends AutoCompleteExtraData>(passedProps: AutoCompleteProps<TData>) => {
  const props = mergeProps(
    { placeholder: 'Select...', autoShowOptions: false, forceSelection: true, isMulti: false, asyncDelay: 350 },
    passedProps,
  );

  // sure sure data is properly set if there is an initial selected value
  const foundOptionIndex = props.isMulti
    ? -1
    : props.options.findIndex((value) => value.value === props.selected?.[0]?.value);
  const focusedOption = foundOptionIndex !== -1 ? props.options[foundOptionIndex] : undefined;
  const focusedOptionIndex = foundOptionIndex !== -1 ? foundOptionIndex : undefined;

  const [autoCompleteStore, setAutoCompleteStore] = createStore<AutoCompleteStore<TData>>({
    ...getAutoCompleteStoreDefaults<TData>(),
    displayOptions: props.getOptionsAsync ? [] : props.options,
    focusedOption,
    focusedOptionIndex,
    inputValue: focusedOption?.display ?? '',
  });

  const getSelectedOptionIndex = (option?: AutoCompleteOption<TData>) => {
    return autoCompleteStore.displayOptions.findIndex((value) => value.value === option?.value);
  };

  const getSelectedValues = () => {
    return props.selected.map((option) => option.value);
  };

  const openAutoComplete = () => {
    if (!props.isMulti) {
      const foundOptionIndex = getSelectedOptionIndex(props.selected[0]);

      if (foundOptionIndex !== -1) {
        setFocusedOption(foundOptionIndex);
      }
    }

    setAutoCompleteStore(
      produce((store) => {
        store.isOpen = props.autoShowOptions ?? false;

        // if we are getting the options from an async source then we don't need to so this since that process
        // happens own its own and ignores the statically passed in options
        if ((props.isMulti || foundOptionIndex !== -1) && !props.getOptionsAsync && props.filterOptions) {
          store.displayOptions = props.filterOptions(
            props.options,
            props.isMulti ? '' : autoCompleteStore.displayOptions[foundOptionIndex].display,
            getSelectedValues(),
          );
        }
      }),
    );
  };

  const closeAutoComplete = () => {
    setAutoCompleteStore(
      produce((store) => {
        // we check this at the top as the selectValue() calls below if need will properly set the input value is
        // there is a selected
        if (props.forceSelection) {
          store.inputValue = !props.isMulti && props.selected.length > 0 ? props.selected[0].display : '';
        }

        store.isOpen = false;
      }),
    );

    autoCompleteStore.inputRef?.blur();
  };

  const getSelectValue = (): AutoCompleteOption<TData> | undefined => {
    if (autoCompleteStore.focusedOption) {
      return autoCompleteStore.focusedOption;
    }

    if (
      (props.selected.length === 0 && !props.forceSelection) ||
      (!props.forceSelection && autoCompleteStore.inputValue)
    ) {
      // @todo(refactor) not sure if there is a way to avoid the explicit cast here
      return {
        display: autoCompleteStore.inputValue,
        value: autoCompleteStore.inputValue,
      } as AutoCompleteOption<TData>;
    }

    return;
  };

  const selectValue = (option: AutoCompleteOption<TData>) => {
    props.setSelected(props.isMulti ? [...props.selected, option] : [option]);

    setAutoCompleteStore(
      produce((store) => {
        store.inputValue = props.isMulti ? '' : option.display;
        store.focusedOption = undefined;
        store.focusedOptionIndex = undefined;

        if (props.isMulti) {
          if (props.getOptionsAsync) {
            store.displayOptions = [];

            return store;
          }

          if (!props.filterOptions) {
            return store;
          }

          store.displayOptions = props.filterOptions(props.options, store.inputValue, getSelectedValues());
        }
      }),
    );
  };

  const removeValue = (selectedIndex: number) => {
    if (props.selected.length === 0) {
      return;
    }

    const deletedOption = props.selected[selectedIndex];

    props.setSelected([...props.selected.slice(0, selectedIndex), ...props.selected.slice(selectedIndex + 1)]);

    if (props.onDeleteOption) {
      props.onDeleteOption(deletedOption);
    }
  };

  const clearSelection = () => {
    if (!props.isMulti) {
      props.setSelected([]);
    }

    setAutoCompleteStore(
      produce((store) => {
        store.isOpen = props.autoShowOptions;
        store.inputValue = '';
        store.focusedOption = undefined;
        store.focusedOptionIndex = undefined;
      }),
    );
  };

  const isFocusedOption = (optionIndex: number) => {
    return autoCompleteStore.focusedOptionIndex === optionIndex;
  };

  const setFocusedOption = (optionIndex: number) => {
    if (optionIndex < 0) {
      optionIndex = autoCompleteStore.displayOptions.length - 1;
    } else if (optionIndex >= autoCompleteStore.displayOptions.length) {
      optionIndex = 0;
    }

    setAutoCompleteStore(
      produce((store) => {
        store.focusedOptionIndex = optionIndex;
        store.focusedOption = store.displayOptions[optionIndex];
      }),
    );
  };

  const clearFocusedOption = () => {
    setAutoCompleteStore(
      produce((store) => {
        store.focusedOptionIndex = undefined;
        store.focusedOption = undefined;
      }),
    );
  };

  const onFocusInput = () => {
    openAutoComplete();
  };

  const onBlurInput = () => {
    if (autoCompleteStore.keepFocusOnBlur) {
      autoCompleteStore.inputRef?.focus();

      setAutoCompleteStore(
        produce((store) => {
          store.keepFocusOnBlur = false;
        }),
      );

      return;
    }

    const selectedValue = getSelectValue();

    if (selectedValue) {
      selectValue(selectedValue);
    }

    closeAutoComplete();
  };

  const onKeyDownInput: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent> = (event) => {
    switch (event.key) {
      case Key.ESCAPE: {
        const hasValue = !!event.currentTarget.value;

        clearSelection();

        // we want to use escape as a way to clear any previous value so if there was one, we don't want to blur
        // to make it easier to clear the current value and start typing for a new one
        if (!hasValue) {
          autoCompleteStore.inputRef?.blur();
        }

        break;
      }

      case Key.ARROW_DOWN:
        // this should make the down arrow start with the first item
        setFocusedOption((autoCompleteStore.focusedOptionIndex ?? -1) + 1);

        break;

      case Key.ARROW_UP:
        // this should make the up arrow start with the last item
        setFocusedOption((autoCompleteStore.focusedOptionIndex ?? autoCompleteStore.displayOptions.length) - 1);

        break;

      case Key.TAB:
      case Key.ENTER: {
        const selectedValue = getSelectValue();

        if (selectedValue) {
          selectValue(selectedValue);
        }

        if (props.isMulti && props.autoShowOptions) {
          return;
        }

        autoCompleteStore.inputRef?.blur();

        break;
      }
    }
  };

  const onKeyUpInput: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent> = (event) => {
    if (event.currentTarget.value === autoCompleteStore.inputValue) {
      return;
    }

    setAutoCompleteStore(
      produce((store) => {
        store.isOpen = event.currentTarget.value !== '';
        store.inputValue = event.currentTarget.value;

        // async options happens in it own effect so we can skip this process
        if (!props.getOptionsAsync && props.filterOptions) {
          store.displayOptions = props.filterOptions(props.options, event.currentTarget.value, getSelectedValues());
        }
      }),
    );
  };

  const onMouseDownOption = (option: AutoCompleteOption<TData>) => {
    selectValue(option);

    if (props.isMulti) {
      setAutoCompleteStore(
        produce((store) => {
          store.keepFocusOnBlur = true;
        }),
      );
    }
  };

  const onMouseEnterOption = (optionIndex: number) => {
    setFocusedOption(optionIndex);
  };

  const onMouseLeaveOption = () => {
    clearFocusedOption();
  };

  const inputRef = (element: HTMLInputElement) => {
    setAutoCompleteStore(
      produce((store) => {
        store.inputRef = element;
      }),
    );
  };

  const getOptionsAsync = debounce(async (inputValue?: string) => {
    if (!props.getOptionsAsync || !inputValue) {
      return;
    }

    setAutoCompleteStore(
      produce((store) => {
        store.isLoadingAsyncOptions = true;
        store.asyncOptionsState = AsyncOptionsState.FETCHING;
      }),
    );

    try {
      const asyncOptions = await props.getOptionsAsync(inputValue);

      setAutoCompleteStore(
        produce((store) => {
          store.displayOptions = asyncOptions;
          store.isLoadingAsyncOptions = false;
          store.asyncOptionsState = AsyncOptionsState.SUCCESSFUL;
        }),
      );
    } catch (error) {
      setAutoCompleteStore(
        produce((store) => {
          store.displayOptions = [];
          store.isLoadingAsyncOptions = false;
          store.asyncOptionsState = AsyncOptionsState.ERROR;
        }),
      );
    }
  }, props.asyncDelay);

  const asyncOptionsAreLoading = () => {
    return (
      autoCompleteStore.asyncOptionsState === AsyncOptionsState.DEBOUNCED ||
      autoCompleteStore.asyncOptionsState === AsyncOptionsState.FETCHING
    );
  };

  const isListOpen = () => {
    return autoCompleteStore.isOpen && autoCompleteStore.asyncOptionsState !== AsyncOptionsState.DEBOUNCED;
  };

  createEffect(() => {
    if (!props.getOptionsAsync) {
      return;
    }

    setAutoCompleteStore(
      produce((store) => {
        store.asyncOptionsState = autoCompleteStore.inputValue
          ? AsyncOptionsState.DEBOUNCED
          : AsyncOptionsState.NOT_APPLICABLE;
      }),
    );

    getOptionsAsync(autoCompleteStore.inputValue);

    onCleanup(() => {
      getOptionsAsync.clear();
    });
  });

  return (
    <div data-id="auto-complete" class={styles.autoComplete}>
      <div>
        <Input
          ref={inputRef}
          type="text"
          placeholder={props.placeholder}
          disabled={autoCompleteStore.disabled}
          value={autoCompleteStore.inputValue}
          onfocus={onFocusInput}
          onblur={onBlurInput}
          onkeydown={onKeyDownInput}
          onkeyup={onKeyUpInput}
        />
      </div>
      <div data-id="options" class={classnames(styles.list, { [styles.openedList]: isListOpen() })}>
        {autoCompleteStore.isOpen && autoCompleteStore.asyncOptionsState === AsyncOptionsState.FETCHING && (
          <li data-id="async-options-loading" class={styles.loadingIndicator}>
            Loading...
          </li>
        )}
        {autoCompleteStore.isOpen && autoCompleteStore.asyncOptionsState !== AsyncOptionsState.FETCHING && (
          <For
            each={autoCompleteStore.displayOptions}
            fallback={
              <Show when={!asyncOptionsAreLoading()}>
                <div data-id="`option no-options-found" class={classnames(styles.selectableOption)}>
                  No Options Found
                </div>
              </Show>
            }
          >
            {(option, optionIndex) => {
              return (
                <Dynamic
                  component={props.selectableComponent ?? SelectableOption}
                  option={option}
                  optionIndex={optionIndex()}
                  isFocusedOption={isFocusedOption}
                  onMouseEnterOption={onMouseEnterOption}
                  onMouseLeaveOption={onMouseLeaveOption}
                  onMouseDownOption={onMouseDownOption}
                />
              );
            }}
          </For>
        )}
      </div>
      {props.isMulti && props.selected.length > 0 && (
        <div data-id="selected-options">
          <For each={props.selected}>
            {(option: AutoCompleteOption<TData>, optionIndex: Accessor<number>) => {
              return (
                <Dynamic
                  component={passedProps.selectedComponent ?? SelectedOption}
                  option={option}
                  optionIndex={optionIndex()}
                  removeValue={removeValue}
                />
              );
            }}
          </For>
        </div>
      )}
    </div>
  );
};

export default AutoComplete;
