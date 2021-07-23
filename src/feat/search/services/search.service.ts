import { repoMgr } from '../../../common/storage/repos/repo-manager.service'
import { EntityClass } from '../../class/models/entity-class.model'
import { EntityClassService } from '../../class/services/entity-class.service'
import { EntityHeader } from '../../entity/model/entity-header.model'
import { EntityHeaderService } from '../../entity/services/entity-header.service'
import { StringIndexable } from '../../indexes/models/StringIndexable'
import { Relation } from '../../relation/models/relation.model'
import { RelationService } from '../../relation/services/relation.service'
import { toNumber } from 'lodash'

// const entityHeaderCache: StringIndexable[] = []
// const entityClassCache: EntityClass[] = []
// const relationCache: Relation[] = []

export class SearchService {
  //   static searchEntityHeaders = async (searchString: string): Promise<StringIndexable[]> => {
  //     const headers = await repoMgr.entHeaders.fullTextSearch(['name'], searchString)

  //     const items: StringIndexable[] = headers.map((header) => {
  //       return {
  //         id: header._id,
  //         namespaceId: header.namespaceId,
  //         value: header.name,
  //         isDeprecated: header.isDeprecated,
  //         classId: header.classId,
  //         version: toNumber(header._rev),
  //       }
  //     })

  //     return items
  //   }

  static searchEntityHeaders = async (searchString: string): Promise<EntityHeader[]> => {
    const headers = await repoMgr.entHeaders.fullTextSearch(['name'], searchString)

    return headers
  }

  static searchEntityClasses = async (searchString: string): Promise<EntityClass[]> => {
    const classes = await repoMgr.classes.fullTextSearch(['name'], searchString)

    return classes
  }

  static searchRelations = async (searchString: string): Promise<Relation[]> => {
    const classes = await repoMgr.relations.fullTextSearch(['name'], searchString)

    return classes
  }
}
