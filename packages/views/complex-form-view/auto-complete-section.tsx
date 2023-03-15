import { Show } from 'solid-js';

import AutoComplete, { autoCompleteUtils } from '$/components/auto-complete';

const getOptionsAsync = async (inputValue?: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      display: `Async Option ${inputValue} 1`,
      value: 1,
    },
    {
      display: `Async Option ${inputValue} 2`,
      value: 2,
    },
    {
      display: `Async Option ${inputValue} 3`,
      value: 3,
    },
  ];
};

const AutoCompleteSection = () => {
  const test1AutoComplete = autoCompleteUtils.createAutoCompleteValue();
  const test2AutoComplete = autoCompleteUtils.createAutoCompleteValue({
    defaultValue: [
      {
        display: 'Option 1',
        value: 1,
      },
    ],
  });
  const test3AutoComplete = autoCompleteUtils.createAutoCompleteValue();

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
        name="test1"
        selectableComponent={AutoComplete.SelectableOption}
        selectedComponent={AutoComplete.SelectedOption}
      />
      <Show when={test1AutoComplete.selected()}>
        selected value: {JSON.stringify(test1AutoComplete.selected(), null, 2)}
      </Show>
      <hr />
      <div>Auto Complete 2</div>
      <AutoComplete
        selected={test2AutoComplete.selected()}
        setSelected={test2AutoComplete.setSelected}
        options={[
          {
            display: 'Option 1',
            value: 1,
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
        name="test2"
        selectableComponent={AutoComplete.SelectableOption}
        selectedComponent={AutoComplete.SelectedOption}
      />
      <Show when={test2AutoComplete.selected()}>
        selected value: {JSON.stringify(test2AutoComplete.selected(), null, 2)}
      </Show>
      <hr />
      <div>Async Auto Complete</div>
      <AutoComplete
        selected={test3AutoComplete.selected()}
        setSelected={test3AutoComplete.setSelected}
        options={[
          {
            display: 'Option 1',
            value: 1,
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
        getOptionsAsync={getOptionsAsync}
        name="test3"
        selectableComponent={AutoComplete.SelectableOption}
        selectedComponent={AutoComplete.SelectedOption}
      />
      <Show when={test3AutoComplete.selected()}>
        selected value: {JSON.stringify(test3AutoComplete.selected(), null, 2)}
      </Show>
    </>
  );
};

export default AutoCompleteSection;
