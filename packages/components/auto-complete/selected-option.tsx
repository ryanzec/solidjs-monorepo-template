import classnames from 'classnames';
import { JSX, splitProps } from 'solid-js';

import styles from '$/components/auto-complete/auto-complete.module.css';
import { AutoCompleteExtraData, AutoCompleteOption } from '$/components/auto-complete/utils';
import Button from '$/components/button';
import { CommonDataAttributes } from '$/types/generic';

export interface SelectedOptionProps<TData extends AutoCompleteExtraData>
  extends JSX.HTMLAttributes<HTMLSpanElement>,
    CommonDataAttributes {
  option: AutoCompleteOption<TData>;
  optionIndex: number;
  removeValue: (optionIndex: number) => void;
}

const SelectedOption = <TData extends AutoCompleteExtraData>(passedProps: SelectedOptionProps<TData>) => {
  const [props, restOfProps] = splitProps(passedProps, ['option', 'optionIndex', 'removeValue', 'class']);
  return (
    <span data-id="selected-option" class={classnames(styles.selectedOption, props.class)} {...restOfProps}>
      {props.option.display}
      <Button
        data-id="delete-indicator"
        class={styles.removeSelectedOption}
        onclick={() => props.removeValue(props.optionIndex)}
      >
        X
      </Button>
    </span>
  );
};

export default SelectedOption;
