import { ulid } from 'ulid'
import { UserFavoriteType } from './UserFavoriteType'

export interface UserFavorite {
  _id: string
  _rev: string
  createdAt: number
  targetId: string
  type: UserFavoriteType
}

export const blankUserFavorite: UserFavorite = {
  _id: '',
  _rev: '',
  targetId: '',
  type: UserFavoriteType.Unassigned,
  createdAt: 0,
}

export class UserFavoriteResource implements UserFavorite {
  _id: string
  _rev: string
  createdAt: number
  constructor(public targetId: string, public type: UserFavoriteType) {
    this._id = ulid()
    this._rev = '1'
    this.createdAt = new Date().getTime()
  }
}
