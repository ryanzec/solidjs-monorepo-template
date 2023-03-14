import classnames from 'classnames';

import styles from '$/components/auto-complete/auto-complete.module.css';
import { AutoCompleteExtraData, AutoCompleteOption } from '$/components/auto-complete/utils';

export interface SelectableOptionProps<TData extends AutoCompleteExtraData> {
  option: AutoCompleteOption<TData>;
  optionIndex: number;
  isFocusedOption: (optionIndex: number) => boolean;
  onMouseEnterOption: (optionIndex: number) => void;
  onMouseLeaveOption: () => void;
  onMouseDownOption: (option: AutoCompleteOption<TData>) => void;
}

const SelectableOption = <TData extends AutoCompleteExtraData>(props: SelectableOptionProps<TData>) => {
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
      {props.option.display}
    </div>
  );
};

export default SelectableOption;
