import { ulid } from 'ulid'
import { UserFavoriteType } from './UserFavoriteType'

export interface UserFavorite {
  _id: string
  _rev: string
  targetId: string
  type: UserFavoriteType
}

export const blankUserFavorite: UserFavorite = {
  _id: '',
  _rev: '',
  targetId: '',
  type: UserFavoriteType.Unassigned,
}

export class UserFavoriteResource implements UserFavorite {
  _id: string
  _rev: string
  constructor(public targetId: string, public type: UserFavoriteType) {
    this._id = ulid()
    this._rev = '1'
  }
}
