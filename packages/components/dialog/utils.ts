import { createSignal } from 'solid-js';

const createDialog = () => {
  const [isOpen, setIsOpen] = createSignal<boolean>(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const toggleDialog = () => {
    setIsOpen(!isOpen());
  };

  return {
    isOpen,
    openDialog,
    closeDialog,
    toggleDialog,
  };
};

export const dialogUtils = {
  createDialog,
};
