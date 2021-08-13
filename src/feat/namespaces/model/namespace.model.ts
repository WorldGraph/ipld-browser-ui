import { ulid } from 'ulid'

export interface Namespace {
  _id: string
  _rev: string
  name: string
  owningUser: string
}

export const blankNamespace: Namespace = {
  _id: '',
  _rev: '',
  name: '',
  owningUser: '',
}

export class NamespaceResource implements Namespace {
  _id: string
  _rev: string

  constructor(public name: string, public owningUser = '') {
    this._id = ulid()
    this._rev = '1'
  }
}
