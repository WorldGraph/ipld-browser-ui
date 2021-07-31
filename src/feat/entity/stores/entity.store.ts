import create from 'zustand'
import { EntityClass } from '../../class/models/entity-class.model'

export interface EntityStoreSchema extends Record<string, unknown> {
  ENTITY_CLASS: EntityClass | null
  ENTITY_ID: string | null
  ENTITY_NAME: string
  ENTITY_NAMESPACE_ID: string
  ENTITY_IS_DEPRECATED: boolean
  setClass: (theClass: EntityClass) => void
  setId: (id: string) => void
  setName: (name: string) => void
  setNamespaceId: (nsId: string) => void
  setIsDeprecated: (isDeprecated: boolean) => void
}

// Entity store using react hooks global state.

export const useEntityStore = create<EntityStoreSchema>((set) => ({
  ENTITY_CLASS: null,
  ENTITY_ID: null,
  ENTITY_NAME: '',
  ENTITY_NAMESPACE_ID: '',
  ENTITY_IS_DEPRECATED: false,
  setClass: (theClass: EntityClass) => {
    set((state) => {
      return { ENTITY_CLASS: theClass }
    })
  },
  setId: (theId: string) => {
    set((state) => {
      return { ENTITY_ID: theId }
    })
  },
  setName: (name: string) => {
    set((state) => {
      return { ENTITY_NAME: name }
    })
  },
  setNamespaceId: (namespaceId: string) => {
    set((state) => {
      return { ENTITY_NAMESPACE_ID: namespaceId }
    })
  },
  setIsDeprecated: (isDeprecated: boolean) => {
    set((state) => {
      return { ENTITY_IS_DEPRECATED: isDeprecated }
    })
  },
}))

export const entityStoreSelectors = {
  entityClass: (state: EntityStoreSchema) => {
    return state.ENTITY_CLASS
  },
  entityId: (state: EntityStoreSchema) => {
    return state.ENTITY_ID
  },
  entityName: (state: EntityStoreSchema) => {
    return state.ENTITY_NAME
  },
  entNamespaceId: (state: EntityStoreSchema) => {
    return state.ENTITY_NAMESPACE_ID
  },
  entIsDeprecated: (state: EntityStoreSchema) => {
    return state.ENTITY_IS_DEPRECATED
  },
  all: (state: EntityStoreSchema) => {
    return state
  },
}

export const entityStoreMutators = {
  setClass: (state: EntityStoreSchema) => state.setClass,
  setId: (state: EntityStoreSchema) => state.setId,
  setIsDeprecated: (state: EntityStoreSchema) => state.setIsDeprecated,
  setName: (state: EntityStoreSchema) => state.setName,
  setNamespaceId: (state: EntityStoreSchema) => state.setNamespaceId,
}
