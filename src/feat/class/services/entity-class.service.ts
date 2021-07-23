import { createWriteStream } from 'fs'
import { repoMgr } from '../../../common/storage/repos/repo-manager.service'
import { blankEntityClass, EntityClass, EntityClassResource } from '../models/entity-class.model'

export class EntityClassService {
  static createEntityClass = async (name: string, namespaceId: string) => {
    const instance = await repoMgr.classes.create(new EntityClassResource(name, namespaceId))
    return instance
  }
  static getEntityClass = async (id: string): Promise<EntityClass | null> => {
    try {
      const entClass = await repoMgr.classes.findById(id)
      return entClass
    } catch (err) {
      console.warn(`Could not find entity class with id ${id}. returning null.`)
      return null
    }

    //     return (await entClass) || blankEntityClass
  }
  static getAllClasses = async (): Promise<EntityClass[]> => {
    await repoMgr.awaitInitialized()
    return await repoMgr.classes.getAll()
  }
}
