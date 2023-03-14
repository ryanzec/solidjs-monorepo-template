import styles from '$/components/auto-complete/auto-complete.module.css';
import { AutoCompleteExtraData, AutoCompleteOption } from '$/components/auto-complete/utils';
import Button from '$/components/button';

export interface SelectedOptionProps<TData extends AutoCompleteExtraData> {
  option: AutoCompleteOption<TData>;
  optionIndex: number;
  removeValue: (optionIndex: number) => void;
}

const SelectedOption = <TData extends AutoCompleteExtraData>(props: SelectedOptionProps<TData>) => {
  return (
    <span data-id="selected-option" class={styles.selectedOption}>
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
