import { NotificationStoreSchema } from '../stores/notification.store'

/**
 * USAGE:
  const notifStore = useNotificiationStore(NotificationStore.selectors.all);
  const notifService = React.useMemo(() => {
    return new NotificationService(notifStore);
  }, [notifStore]);
 */
export class NotificationService {
  constructor(private store: NotificationStoreSchema) {}
  public notify = (newMsg: string) => {
    const newMsgs = [newMsg, ...this.store.notifMessages]
    this.store.setNotifMessages(newMsgs)

    setTimeout(() => {
      this.store.setNotifMessages(newMsgs.slice(0, -1))
    }, 5000)
  }
}
