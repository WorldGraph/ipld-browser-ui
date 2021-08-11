import { UserFavorite } from './user-favorite.model'

export interface UserFavoriteReadable extends UserFavorite {
  name: string
  className: string
}
