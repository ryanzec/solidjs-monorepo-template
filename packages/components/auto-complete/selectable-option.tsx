import classnames from 'classnames';
import { JSX, splitProps } from 'solid-js';

import styles from '$/components/auto-complete/auto-complete.module.css';
import { AutoCompleteExtraData, AutoCompleteOption } from '$/components/auto-complete/utils';
import { CommonDataAttributes } from '$/types/generic';

export interface SelectableOptionProps<TData extends AutoCompleteExtraData>
  extends JSX.HTMLAttributes<HTMLDivElement>,
    CommonDataAttributes {
  option: AutoCompleteOption<TData>;
  optionIndex: number;
  isFocusedOption: (optionIndex: number) => boolean;
  onMouseEnterOption: (optionIndex: number) => void;
  onMouseLeaveOption: () => void;
  onMouseDownOption: (option: AutoCompleteOption<TData>) => void;
}

const SelectableOption = <TData extends AutoCompleteExtraData>(passedProps: SelectableOptionProps<TData>) => {
  const [props, restOfProps] = splitProps(passedProps, [
    'option',
    'optionIndex',
    'isFocusedOption',
    'onMouseDownOption',
    'onMouseEnterOption',
    'onMouseLeaveOption',
    'class',
  ]);
  const dataId = () => `option${props.isFocusedOption(props.optionIndex) ? ' highlighted-option' : ''}`;

  return (
    <div
      data-id={dataId()}
      class={classnames(styles.selectableOption, props.class, {
        [styles.highlightedOption]: props.isFocusedOption(props.optionIndex),
      })}
      onmouseenter={() => props.onMouseEnterOption(props.optionIndex)}
      onmouseleave={() => props.onMouseLeaveOption()}
      onmousedown={() => props.onMouseDownOption(props.option)}
      role="button"
      tabindex={-1}
      {...restOfProps}
    >
      {props.option.display}
    </div>
  );
};

export default SelectableOption;
