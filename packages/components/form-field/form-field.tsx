import classnames from 'classnames';
import { JSX, ParentProps, splitProps } from 'solid-js';

import styles from '$/components/form-field/form-field.module.css';
import { CommonDataAttributes } from '$/types/generic';

type FormFieldProps = JSX.HTMLAttributes<HTMLDivElement> & CommonDataAttributes;

const FormField = (passedProps: ParentProps<FormFieldProps>) => {
  const [props, restOfProps] = splitProps(passedProps, ['class', 'children']);

  return (
    <div data-id="form-field" class={classnames(styles.formField, props.class)} {...restOfProps}>
      {props.children}
    </div>
  );
};

export default FormField;
