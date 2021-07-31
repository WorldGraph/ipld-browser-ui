import { ulid } from 'ulid'

export interface EntityDocument {
  _id: string
  _rev: string
  documentJson: string
}

export const blankEntityDocument: EntityDocument = {
  _id: '',
  _rev: '',
  documentJson: '',
}
export class EntityDocumentResource implements EntityDocument {
  _id: string
  _rev: string
  constructor(public documentJson: string) {
    this._id = ulid()
    this._rev = '1'
  }
}
