import { NotImplementedException } from '../../../common/exceptions/not-implemented.exception'
import { EntityHeader } from '../../entity/model/entity-header.model'
import { Relation } from '../../relation/models/relation.model'

export class IndexService {
  static UpsertEntNameIndexEntries = async (headers: EntityHeader[]) => {
    throw new NotImplementedException('Method')
    // const entries: StringIndexable[] = []

    // headers.forEach((item) => {
    //   const itemIxable: StringIndexable = {
    //     id: item._id,
    //     namespaceId: item.namespaceId,
    //     value: item.name,
    //     isDeprecated: false,
    //     classId: item.classId,
    //     version: 0,
    //   }
    //   entries.push(itemIxable)
    // })

    // const itemEntry: IndexEntries = {
    //   values: entries,
    // }

    // await UpsertEntNameIndexEntries([itemEntry])
  }

  static getEntityName = async (entId: string) => {
    throw new NotImplementedException('Method')
    // try {
    //   const entry = await getEntryById(IndexName.entities, entId)
    //   return entry.value
    // } catch (err) {
    //   return '[name not found]'
    // }
  }

  static getFullEntity = async (eid: string): Promise<EntityHeader> => {
    throw new NotImplementedException('Method')
    // const entry = await getEntryById(IndexName.entities, eid)
    // const entity: EntityHeader = {
    //   _id: entry.id,
    //   namespaceId: entry.namespaceId,
    //   name: entry.value,
    //   classId: entry.classId,
    //   isDeprecated: IndexService.bitToBool(entry.isDeprecated),
    //   replacedBy: '',
    // }
    // return entity
  }

  static getFullRelation = async (relationId: string): Promise<Relation> => {
    throw new NotImplementedException('Method')
    // const entry = await getEntryById(IndexName.relations, relationId)
    // const relation: Relation = {
    //   _id: relationId,
    //   namespaceId: entry.namespaceId,
    //   name: entry.value,
    // }
    // return relation
  }

  static bitToBool = (input: boolean | 0 | 1) => {
    if (input === 0) return false
    if (input === 1) return true
    return input
  }

  static boolToBit = (input: boolean) => {
    if (input === true) return 1
    return 0
  }
}
