import { ulid } from 'ulid'

export interface EntityDocument {
  _id: string
  _rev: string
  createdAt: number
  documentJson: string
}

export const blankEntityDocument: EntityDocument = {
  _id: '',
  _rev: '',
  documentJson: '',
  createdAt: 0,
}
export class EntityDocumentResource implements EntityDocument {
  _id: string
  _rev: string
  createdAt: number
  constructor(isNew: boolean, entityId: string, public documentJson: string) {
    this._id = entityId
    this._rev = isNew ? '1' : ''
    this.createdAt = new Date().getTime()
  }
}
