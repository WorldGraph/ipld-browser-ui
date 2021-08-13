import { BasicProfile } from '@ceramicstudio/idx-constants'
import { getLoggedInDID } from '../../../common/ceramic_utils/client/idx.state'
import { SelfID } from '../../../common/ceramic_utils/sdk/web'
import { repoMgr } from '../../../common/storage/repos/repo-manager.service'
import { Namespace, NamespaceResource } from '../model/namespace.model'

export class NamespaceService {
  static getAvailableForUser = async (): Promise<Namespace[]> => {
    // TODO - not implemented
    return []
    // throw new NotImplementedException('Method')
  }

  static async createNamespace(name: string, owningUser: string): Promise<Namespace> {
    const instance = await repoMgr.namespaces.create(new NamespaceResource(name, owningUser))
    //     await instance.save()
    return instance
  }

  static async getById(namespaceId: string): Promise<Namespace | null> {
    return await repoMgr.namespaces.findById(namespaceId)
  }

  static async getOrCreateUserDefaultNs(): Promise<Namespace> {
    const did = getLoggedInDID()
    if (!did) {
      throw new Error(`Could not get logged in DID!  User is not logged in.`)
    }

    const found = await this.getById(did)
    if (found) {
      return found
    } else {
      return await this.createNamespace(did, did)
    }
  }
}
