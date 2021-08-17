import { repoMgr } from '../../../common/storage/repos/repo-manager.service'
import { EntityHeader, EntityHeaderResource } from '../model/entity-header.model'

export class EntityHeaderService {
  /**
   * @returns {string} the ID of the newly created entity
   */
  static createEntity = async (name: string, namespaceId: string): Promise<EntityHeader> => {
    try {
      const instance = await repoMgr.entHeaders.create(new EntityHeaderResource(namespaceId, name))
      return instance
    } catch (err) {
      console.error(`Error creating entity header!`, err)
      throw err
    }
  }

  static updateEntityName = async (entityId: string, newName: string) => {
    try {
      let header = await repoMgr.entHeaders.findById(entityId)
      if (header == null) throw new Error('No entity found with id' + entityId)
      header.name = newName
      header = { ...header, name: newName }
      await repoMgr.entHeaders.upsert(header)
    } catch (err) {
      console.error(`Error in updateEntityClass for entityId ${entityId}`)
      throw err
    }
  }

  static getEntityHeader = async (entityId: string): Promise<EntityHeader> => {
    if (!entityId) {
      throw new Error(`entityId cannot be undefined in getEntityHeader function.`)
    }

    try {
      await repoMgr.awaitInitialized()
      const res = await repoMgr.entHeaders.findById(entityId)
      if (res) return res

      throw new Error(`cannot find entity header with id ${entityId}`)
    } catch (err) {
      console.error(`Error getting entity id ${entityId}!`)
      throw err
    }
  }

  static getEntityHeaderCount = async () => {
    await repoMgr.awaitInitialized()
    const count = await repoMgr.entHeaders.count()
    return count
  }

  static getAllEntityHeaders = async (): Promise<EntityHeader[]> => {
    await repoMgr.awaitInitialized()
    return await repoMgr.entHeaders.getAll()
  }

  static updateEntityClass = async (entityId: string, classId: string) => {
    try {
      const header = await repoMgr.entHeaders.findById(entityId)
      if (header == null) throw new Error('No entity found with id' + entityId)
      await repoMgr.entHeaders.upsert({ ...header, classId: classId })
    } catch (err) {
      console.error(`Error in updateEntityClass for entityId ${entityId}`)
      throw err
    }
  }
}
