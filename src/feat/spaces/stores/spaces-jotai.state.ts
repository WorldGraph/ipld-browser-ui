import { Atom, atom } from 'jotai'
import { blankNamespace, Namespace } from '../model/namespace.model'

export const CurrentSpaceIdAtom = atom('')

// TODO - connect with service
export const CurrentSpaceAtom = atom(async (get) => {
  const currentSpaceId = get(CurrentSpaceIdAtom)
  return blankNamespace
})

// TODO - connect with service
export const AvailableSpacesAtom: Atom<Namespace[]> = atom(async (get) => {
  const availableSpacesIds = get(AvailableSpaceIdsAtom)
  return []
})

export const SelectedSpaceIdsAtom = atom(['first'])

// TODO - connect with service
export const SelectedSpacesAtom = atom(async (get) => {
  const availableSpacesIds = get(SelectedSpaceIdsAtom)
  return []
})

export const AvailableSpaceIdsAtom = atom([] as string[])
