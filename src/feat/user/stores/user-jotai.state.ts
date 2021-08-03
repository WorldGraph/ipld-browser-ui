import { atom } from 'jotai'
import { blankUserModel } from '../models/user.model'

// TODO - set to default false after auth is totally working
export const userIsAuthenticatedAtom = atom(true)
export const userProfileAtom = atom(blankUserModel)
