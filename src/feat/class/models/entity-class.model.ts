import { ulid } from 'ulid'

export interface EntityClass {
  _id: string
  _rev: string
  createdAt: number
  namespaceId: string
  name: string
}

export const blankEntityClass: EntityClass = {
  _id: '',
  _rev: '',
  namespaceId: '',
  name: 'No type assigned',
  createdAt: 0,
}

export class EntityClassResource implements EntityClass {
  _id: string
  _rev: string
  createdAt: number
  constructor(public name: string, public namespaceId: string) {
    this._id = ulid()
    this._rev = '1'
    this.createdAt = new Date().getTime()
  }
}
