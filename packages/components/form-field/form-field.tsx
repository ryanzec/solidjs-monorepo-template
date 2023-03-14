import { ParentComponent } from 'solid-js';

import styles from '$/components/form-field/form-field.module.css';

const FormField: ParentComponent = (props) => {
  return <div class={styles.formField}>{props.children}</div>;
};

export default FormField;
