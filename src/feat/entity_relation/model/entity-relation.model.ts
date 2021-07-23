import { ulid } from 'ulid'

export interface EntityRelation {
  _id: string
  _rev: string
  relationId: string
  sourceId: string
  targetId: string
}

export enum EntityRelationKeys {
  _id = 'id',
  relationId = 'relationId',
  sourceId = 'sourceId',
  targetId = 'targetId',
}

export const blankEntityRelation: EntityRelation = {
  _id: '',
  _rev: '',
  relationId: '',
  sourceId: '',
  targetId: '',
}

export class EntityRelationResource implements EntityRelation {
  _id: string
  _rev: string
  constructor(public relationId: string, public sourceId: string, public targetId: string) {
    this._id = ulid()
    this._rev = '1'
  }
}
