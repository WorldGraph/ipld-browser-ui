import { ulid } from 'ulid'

export interface Relation {
  _id: string
  _rev: string
  namespaceId: string
  name: string
}

export const blankRelation: Relation = {
  _id: '',
  _rev: '',
  namespaceId: '',
  name: '',
}

export class RelationResource implements Relation {
  _id: string
  _rev: string
  constructor(public namespaceId: string, public name: string) {
    this._id = ulid()
    this._rev = '1'
  }
}
