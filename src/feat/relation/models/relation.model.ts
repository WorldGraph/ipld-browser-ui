import { ulid } from 'ulid'

export interface Relation {
  _id: string
  _rev: string
  createdAt: number
  namespaceId: string
  name: string
}

export const blankRelation: Relation = {
  _id: '',
  _rev: '',
  namespaceId: '',
  name: '',
  createdAt: 0,
}

export class RelationResource implements Relation {
  _id: string
  _rev: string
  createdAt: number
  constructor(public namespaceId: string, public name: string) {
    this._id = ulid()
    this._rev = '1'
    this.createdAt = new Date().getTime()
  }
}
