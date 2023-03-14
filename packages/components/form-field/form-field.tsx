import classnames from 'classnames';
import { JSX, ParentProps, splitProps } from 'solid-js';

import styles from '$/components/form-field/form-field.module.css';

type FormFieldProps = JSX.HTMLAttributes<HTMLDivElement>;

const FormField = (passedProps: ParentProps<FormFieldProps>) => {
  const [props, restOfProps] = splitProps(passedProps, ['class', 'children']);
  return (
    <div class={classnames(styles.formField, props.class)} {...restOfProps}>
      {props.children}
    </div>
  );
};

export default FormField;
