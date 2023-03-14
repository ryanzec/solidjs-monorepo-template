import Button from '$/components/button/button';
import Dialog from '$/components/dialog/dialog';
import { dialogUtils } from '$/components/dialog/utils';

export default {
  title: 'Packages/Components/Dialog',
};

export const Default = () => {
  const dialogStore = dialogUtils.createDialog();

  return (
    <div>
      <Button onclick={dialogStore.openDialog}>Toggle Dialog</Button>
      <Dialog isOpen={dialogStore.isOpen()} closeDialog={dialogStore.closeDialog} />
    </div>
  );
};
