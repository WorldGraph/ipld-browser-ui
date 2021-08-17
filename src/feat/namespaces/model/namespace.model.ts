import { ulid } from 'ulid'

export interface Namespace {
  _id: string
  _rev: string
  createdAt: number
  name: string
  owningUser: string
  isPrivate: boolean
}

export const blankNamespace: Namespace = {
  _id: '',
  _rev: '',
  name: '',
  owningUser: '',
  createdAt: 0,
  isPrivate: true,
}

export class NamespaceResource implements Namespace {
  _id: string
  _rev: string
  createdAt: number

  constructor(public name: string, public owningUser = '', public isPrivate = true) {
    this._id = ulid()
    this._rev = '1'
    this.createdAt = new Date().getTime()
  }
}
