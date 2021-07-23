import { NotImplementedException } from '../../../common/exceptions/not-implemented.exception'
import { repoMgr } from '../../../common/storage/repos/repo-manager.service'
import { UserModel } from '../models/user.model'

export class UserService {
  static getUserByPublicKey = async (publicKey: string) => {
    throw new NotImplementedException('Method')
    // const user = (await repoMgr.users.find('publicKey', publicKey))[0]
    // return user || null
  }

  static createUser = async (user: UserModel) => {
    try {
      const instance = repoMgr.users.create(user)
      //       await instance.save()
      return instance
    } catch (err) {
      console.error(`Error saving user`, err)
      throw err
    }
  }
}
