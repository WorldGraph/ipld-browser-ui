import { Atom, atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { getLoggedInDID } from '../../../common/ceramic_utils/client/idx.state'

import { Namespace } from '../model/namespace.model'
import { NamespaceService } from '../services/namespace.service'

export const CurrentNamespaceIdAtom = atomWithStorage(
  'currentNamespaceId',
  localStorage.getItem('currentNamespaceId') ?? '',
)

export const CurrentSpaceDisplayNameAtom = atom(async (get) => {
  const ns = get(CurrentSpaceAtom)
  const myDid = getLoggedInDID()
  if (!ns?.name) return '[no space]'
  if (ns.name === myDid) {
    return 'My Private Space'
  } else {
    return ns.name
  }
})

export const CurrentSpaceAtom = atom(async (get) => {
  const currentSpaceId = get(CurrentNamespaceIdAtom)
  const space = await NamespaceService.getById(currentSpaceId)
  return space
})

export const AvailableSpacesAtom: Atom<Namespace[]> = atom(async (get) => {
  return await NamespaceService.getAll()
})

export const SelectedSpaceIdsAtom = atom(['first'])

export const SelectedSpacesAtom = atom(async (get) => {
  const availableSpacesIds = get(SelectedSpaceIdsAtom)
  return []
})

export const UserDefaultNamespaceIdAtom = atom('')
