import { ulid } from 'ulid'

export interface EntityHeader {
  _id: string
  _rev: string
  createdAt: number
  namespaceId: string
  name: string
  classId: string
  isDeprecated: boolean
  replacedBy: string
  // Owning DID
  owningUser: string
}

export const blankEntityHeader: EntityHeader = {
  _id: '',
  _rev: '',
  namespaceId: '',
  name: '',
  classId: '',
  isDeprecated: false,
  replacedBy: '',
  owningUser: '',
  createdAt: 0,
}

export class EntityHeaderResource implements EntityHeader {
  _id: string
  _rev: string
  createdAt: number

  constructor(
    public namespaceId: string,
    public name: string,
    public classId = '',
    public isDeprecated = false,
    public replacedBy = '',
    public owningUser = '',
  ) {
    this._id = ulid()
    this._rev = '1'
    this.createdAt = new Date().getTime()
  }
}
