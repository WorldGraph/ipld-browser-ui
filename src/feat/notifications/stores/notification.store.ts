import create from 'zustand'
export interface NotificationStoreSchema extends Record<string, unknown> {
  notifMessages: string[]
  numServerWaiters: number
  incrementWaiters: () => void
  decrementWaiters: () => void
  resetWaiters: () => void
  setNotifMessages: (msgs: string[]) => void
}

export const useNotificationStore = create<NotificationStoreSchema>((set) => ({
  notifMessages: [],
  numServerWaiters: 0,
  incrementWaiters: () => {
    set((state) => {
      return { numServerWaiters: state.numServerWaiters + 1 }
    })
  },
  decrementWaiters: () => {
    set((state) => {
      if (state.numServerWaiters <= 0) return { numServerWaiters: 0 }

      return { numServerWaiters: state.numServerWaiters - 1 }
    })
  },
  resetWaiters: () => {
    set((state) => {
      return { numServerWaiters: 0 }
    })
  },
  setNotifMessages: (msgs: string[]) => {
    set((state) => {
      return { notifMessages: msgs }
    })
  },
}))

// export function doNotify(store: NotificationStoreSchema) {
//   const newMsgs = [newMsg, ...curMsgs];
//   setMsgs(newMsgs);

//   setTimeout(() => {
//     setMsgs(newMsgs.slice(0, -1));
//   }, 5000);
// }

export const notifSelectors = {
  numWaiters: (state: NotificationStoreSchema) => {
    return state.numServerWaiters
  },
  notifMessages: (state: NotificationStoreSchema) => {
    return state.notifMessages
  },
  all: (state: NotificationStoreSchema) => {
    return state
  },
}

export const notifMutators = {
  incrementWaiters: (state: NotificationStoreSchema) => state.incrementWaiters,
  decrementWaiters: (state: NotificationStoreSchema) => state.decrementWaiters,
  resetWaiters: (state: NotificationStoreSchema) => state.resetWaiters,
}
