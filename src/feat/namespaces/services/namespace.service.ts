import { getLoggedInDID } from '../../../common/ceramic_utils/client/idx.state'
import { repoMgr } from '../../../common/storage/repos/repo-manager.service'
import { Namespace, NamespaceResource } from '../model/namespace.model'

export class NamespaceService {
  static getAll = async (): Promise<Namespace[]> => {
    const currentDid = getLoggedInDID()
    const namespaces = await repoMgr.namespaces.getAll()
    for (const ns of namespaces) {
      if (ns.name === currentDid) ns.name = 'My Private Space'
    }
    return namespaces
  }

  static async createNamespace(name: string, owningUser: string): Promise<Namespace> {
    const instance = await repoMgr.namespaces.create(new NamespaceResource(name, owningUser))
    //     await instance.save()
    return instance
  }

  static async getById(namespaceId: string): Promise<Namespace | null> {
    return await repoMgr.namespaces.findById(namespaceId)
  }

  static async getByName(namespaceId: string): Promise<Namespace | null> {
    return await repoMgr.namespaces.findOneByName(namespaceId)
  }

  static async getOrCreateUserDefaultNs(): Promise<Namespace> {
    const did = getLoggedInDID()
    if (!did) {
      throw new Error(`Could not get logged in DID!  User is not logged in.`)
    }

    const found = await this.getByName(did)
    if (found) {
      return found
    } else {
      return await this.createNamespace(did, did)
    }
  }
}
