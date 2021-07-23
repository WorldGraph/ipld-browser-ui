import { Element as SlateNode } from 'slate'

import { NotImplementedException } from '../../../../common/exceptions/not-implemented.exception'
import { repoMgr } from '../../../../common/storage/repos/repo-manager.service'
import { blankEntityClass, EntityClass } from '../../../class/models/entity-class.model'
import { EntityClassService } from '../../../class/services/entity-class.service'
import { EntityRelationService } from '../../../entity_relation/services/entity-relation.service'
import { StringIndexable } from '../../../indexes/models/StringIndexable'
import { UserFavorite } from '../../../preferences/models/user-favorite.model'
import { UserFavoritesService } from '../../../preferences/services/user-favorites.service'
import { RelationService } from '../../../relation/services/relation.service'
import { EntityHeader } from '../../model/entity-header.model'
import { EntityDocService } from '../../services/entity-doc.service'
import { EntityHeaderService } from '../../services/entity-header.service'
import { initialEditorValue } from '../entity-panel.component'

export async function setEntityIsFavorite(
  entId: string,
  isFavorite: boolean,
  incrementWaiters: () => void,
  decrementWaiters: () => void,
): Promise<void> {
  incrementWaiters()
  if (isFavorite) {
    await UserFavoritesService.createFavorite(entId)
  } else {
    await UserFavoritesService.deleteFavorite(entId)
  }
  decrementWaiters()
}

export async function createEntityRelation(
  sourceEntityId: string,
  relationId: string,
  targetEntityId: string,
): Promise<string> {
  const entRel = await EntityRelationService.createEntityRelation(
    sourceEntityId,
    targetEntityId,
    relationId,
  )
  return entRel._id
}

export async function createNewRelationFromName(
  name: string,
  namespaceId: string,
): Promise<string> {
  const rel = await RelationService.createRelation(name, namespaceId)
  return rel._id
}

export async function upsertEntityDocument(entityId: string, updatedDoc: SlateNode[]) {
  throw new NotImplementedException('upsertEntityDocument')
  // const req: UpsertEntityDocCommand = {
  //   EntityId: entityId,
  //   UpdatedDocumentNodes: updatedDoc,
  // }
  // await entityDal.upsertEntityDocument(req)
}

export async function getUserFavoritesForTarget(
  targetId: string,
  callback: (favs: UserFavorite[]) => void,
) {
  const res = await UserFavoritesService.getForTargetId(targetId)
  callback(res)
}

export async function rehydrateEntity(
  entityId: string,
  setCurrentEntity: (entity: EntityHeader) => void,
  setSlateEditorContent: (input: SlateNode[]) => void,
  setEntityModificationProps: any,
  incrementWaiters: () => void,
  decrementWaiters: () => void,
  setEntityClass: (entClass: EntityClass) => void,
) {
  // throw new NotImplementedException('rehydrateEntity')
  incrementWaiters()
  const entHeader = await EntityHeaderService.getEntityHeader(entityId)

  setCurrentEntity(entHeader)

  const entClass = await EntityClassService.getEntityClass(entHeader.classId)

  setEntityClass(entClass || blankEntityClass)

  // Hydrate entity document
  const doc = await EntityDocService.getDocument(entityId)

  if (doc) {
    const content = JSON.parse(doc.documentJson)
    setSlateEditorContent(content)
  } else {
    setSlateEditorContent(initialEditorValue)
  }

  decrementWaiters()
}
