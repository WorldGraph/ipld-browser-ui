import create from 'zustand'
import { AuthenticationService } from '../../authn/services/AuthNService'
import { blankUser, UserModel } from '../models/user.model'

// New zustand implementation

export interface UserStoreSchema extends Record<string, unknown> {
  IS_AUTHENTICATED: boolean
  USER_INFO: UserModel
  setUser: (user: UserModel) => void
}

export const useUserStore = create<UserStoreSchema>((set) => ({
  IS_AUTHENTICATED: false,
  USER_INFO: blankUser,
  setUser: (user: UserModel) => {
    console.log(`setting user to `, user)
    set((state) => {
      return { USER_INFO: user }
    })
  },
}))

export const userStoreSelectors = {
  user: (state: UserStoreSchema) => {
    return state.USER_INFO
  },
  isLoggedIn: (state: UserStoreSchema) => {
    return AuthenticationService.isLoggedIn
    //     return state.USER_INFO.publicKey != ''
  },
}

export const userStoreMutators = {
  setUser: (state: UserStoreSchema) => state.setUser,
}
