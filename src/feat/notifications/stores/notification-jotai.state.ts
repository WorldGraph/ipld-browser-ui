import { atom } from 'jotai'

export const NotifMessagesAtom = atom([] as string[])

export const WaitersCountAtom = atom(0)

export const DecrementWaitersAtom = atom(null, (get, set, _arg) => {
  set(WaitersCountAtom, get(WaitersCountAtom) - 1)
})

export const IncrementWaitersAtom = atom(null, (get, set, _arg) => {
  set(WaitersCountAtom, get(WaitersCountAtom) + 1)
})

export const ResetWaitersAtom = atom(null, (get, set, _arg) => {
  set(WaitersCountAtom, get(WaitersCountAtom) + 1)
})
