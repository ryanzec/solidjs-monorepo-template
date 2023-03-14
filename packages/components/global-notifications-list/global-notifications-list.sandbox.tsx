import Button from '$/components/button/button';
import { globalNotificationsStore } from '$/stores/global-notifications-store';

export default {
  title: 'Packages/Components/GlobalNotificationsList',
};

export const Default = () => {
  return (
    <>
      <Button
        onClick={() => {
          globalNotificationsStore.addNotification({ message: 'This is a test message', autoClose: 2000 });
        }}
      >
        Add Temp Notification
      </Button>
      <Button
        onClick={() => {
          globalNotificationsStore.addNotification({ message: 'This is a test message' });
        }}
      >
        Add Perm Notification
      </Button>
    </>
  );
};
