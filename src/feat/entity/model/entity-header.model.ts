import { ulid } from 'ulid'

export interface EntityHeader {
  _id: string
  _rev: string
  namespaceId: string
  name: string
  classId: string
  isDeprecated: boolean
  replacedBy: string
}

export const blankEntityHeader: EntityHeader = {
  _id: '',
  _rev: '',
  namespaceId: '',
  name: '',
  classId: '',
  isDeprecated: false,
  replacedBy: '',
}

export class EntityHeaderResource implements EntityHeader {
  _id: string
  _rev: string

  constructor(
    public namespaceId: string,
    public name: string,
    public classId = '',
    public isDeprecated = false,
    public replacedBy = '',
  ) {
    this._id = ulid()
    this._rev = '1'
  }
}
