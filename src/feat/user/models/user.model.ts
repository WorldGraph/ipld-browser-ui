import { ulid } from 'ulid'

export interface UserModel {
  _id: string
  _rev: string
  publicKey: string
  userName: string
  email: string
  firstName: string
  lastName: string
  defaultNamespaceId: string
}

export const blankUserModel: UserModel = {
  _id: '',
  _rev: '',
  publicKey: '',
  userName: 'username',
  email: '',
  firstName: 'Your',
  lastName: 'Name',
  defaultNamespaceId: 'default',
}

export class UserResource implements UserModel {
  _id: string
  _rev: string
  constructor(
    public publicKey: string,
    public userName: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public defaultNamespaceId: string,
  ) {
    this._id = ulid()
    this._rev = '1'
  }
}
