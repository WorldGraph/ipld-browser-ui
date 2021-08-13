import { Atom, atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { Namespace } from '../model/namespace.model'
import { NamespaceService } from '../services/namespace.service'

export const CurrentNamespaceIsAtom = atomWithStorage(
  'currentNamespaceId',
  localStorage.getItem('currentNamespaceId') ?? '',
)

// TODO - connect with service
export const CurrentSpaceAtom = atom(async (get) => {
  const currentSpaceId = get(CurrentNamespaceIsAtom)
  console.log(`GETTING CURRENT SPACE for namespace id`, currentSpaceId)
  const space = await NamespaceService.getById(currentSpaceId)
  return space
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

export const UserDefaultNamespaceIdAtom = atom('')
