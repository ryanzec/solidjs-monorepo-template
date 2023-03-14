import { onCleanup, ParentComponent, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import Button from '$/components/button/button';
import styles from '$/components/dialog/dialog.module.css';
import Overlay from '$/components/overlay';
import { Key } from '$/types/generic';

interface DialogProps {
  isOpen: boolean;
  closeDialog: () => void;
}

const Dialog: ParentComponent<DialogProps> = (props) => {
  const modalRef = () => {
    const keyDownListener = (event: KeyboardEvent) => {
      if (event.key === Key.ESCAPE) {
        props.closeDialog();
      }
    };

    document.addEventListener('keydown', keyDownListener);

    onCleanup(() => {
      document.removeEventListener('keydown', keyDownListener);
    });
  };

  return (
    <Show when={props.isOpen}>
      <Portal>
        <div ref={modalRef} class={styles.dialog}>
          <Button onclick={() => props.closeDialog()}>Close</Button>
          {props.children}
        </div>
      </Portal>
      <Overlay />
    </Show>
  );
};

export default Dialog;
