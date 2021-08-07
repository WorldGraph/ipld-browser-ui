import { atom } from 'jotai'
import { blankEntityClass } from '../../class/models/entity-class.model'

export const entityNameAtom = atom('')

export const entityIdAtom = atom('')

export const entityClassAtom = atom(blankEntityClass)

export const entityIsDeprecatedAtom = atom(false)

export const entityNamespaceIdAtom = atom('')
