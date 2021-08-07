import { BasicProfile } from '@ceramicstudio/idx-constants'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { blankUserModel } from '../models/user.model'

export const userProfileAtom = atom(blankUserModel)

export const UserBasicProfileAtom = atomWithStorage<BasicProfile>('basicProfile', {})
