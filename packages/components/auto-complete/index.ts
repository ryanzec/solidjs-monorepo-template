import AutoComplete from '$/components/auto-complete/auto-complete';
import SelectableOption from '$/components/auto-complete/selectable-option';
import SelectedOption from '$/components/auto-complete/selected-option';

export { autoCompleteUtils } from '$/components/auto-complete/utils';

export type { AutoCompleteOption } from '$/components/auto-complete/utils';

export default Object.assign(AutoComplete, { SelectableOption, SelectedOption });
