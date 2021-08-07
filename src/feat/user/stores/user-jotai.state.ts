import { atom } from 'jotai'
import { blankUserModel } from '../models/user.model'

export const userProfileAtom = atom(blankUserModel)
