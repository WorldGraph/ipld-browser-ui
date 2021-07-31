import { repoMgr } from '../../../common/storage/repos/repo-manager.service'
import { EntityHeaderService } from '../../entity/services/entity-header.service'
import { RelationService } from '../../relation/services/relation.service'
import { EntityRelation, EntityRelationResource } from '../model/entity-relation.model'
import {
  EntityRelationOneSide,
  EntityRelationOneSideResource,
} from '../model/entity-relation-one-side.component'

export class EntityRelationService {
  static getInboundRelationsReadable = async (eid: string): Promise<EntityRelationOneSide[]> => {
    await repoMgr.awaitInitialized()
    const relations = await repoMgr.entRelations.find({ targetId: { $eq: eid } })

    const mapped = Promise.all(
      relations.map(async (rel) => {
        // 'target' for inbound relation is actually the source
        const target = await EntityHeaderService.getEntityHeader(rel.sourceId)
        const relation = await RelationService.getRelation(rel.relationId)

        return new EntityRelationOneSideResource(
          rel._id,
          target.name,
          target._id,
          relation._id,
          relation.name,
        )
      }),
    )

    return mapped
  }

  static getOutboundRelationsReadable = async (eid: string): Promise<EntityRelationOneSide[]> => {
    await repoMgr.awaitInitialized()

    const relations = await repoMgr.entRelations.find({ sourceId: { $eq: eid } })

    const mapped = Promise.all(
      relations.map(async (rel) => {
        const target = await EntityHeaderService.getEntityHeader(rel.targetId)
        const relation = await RelationService.getRelation(rel.relationId)

        return new EntityRelationOneSideResource(
          rel._id,
          target.name,
          target._id,
          relation._id,
          relation.name,
        )
      }),
    )

    return mapped
  }

  static deleteEntityRelation = async (id: string, rev: string) => {
    await repoMgr.entRelations.deleteById(id, rev)
  }

  /**
   * creates entity relation and returns its id
   */
  static createEntityRelation = async (
    sourceId: string,
    targetId: string,
    relationId: string,
  ): Promise<EntityRelation> => {
    try {
      const instance = repoMgr.entRelations.create(
        new EntityRelationResource(relationId, sourceId, targetId),
      )
      //       await instance.save()
      return instance
    } catch (err) {
      console.error(`error writing new entity relation`, err)
      throw err
    }
  }

  static async getAllEntityRelations() {
    await repoMgr.awaitInitialized()
    return await repoMgr.entRelations.getAll()
  }
}
