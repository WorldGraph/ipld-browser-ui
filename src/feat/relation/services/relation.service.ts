import { repoMgr } from '../../../common/storage/repos/repo-manager.service'
import { blankRelation, Relation, RelationResource } from '../models/relation.model'

export class RelationService {
  static createRelation = async (name: string, namespaceId: string) => {
    const rel = await repoMgr.relations.create(new RelationResource(namespaceId, name))
    return rel
  }
  static getRelation = async (id: string): Promise<Relation> => {
    const entClass = await repoMgr.relations.findById(id)
    return entClass || blankRelation
  }
  static getAllRelations = async (): Promise<Relation[]> => {
    await repoMgr.awaitInitialized()
    return await repoMgr.relations.getAll()
  }
}
