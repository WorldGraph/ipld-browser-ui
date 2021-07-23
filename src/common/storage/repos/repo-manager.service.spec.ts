import { expect } from 'chai'

import { blankEntityClass } from '../../../feat/class/models/entity-class.model'
import { blankEntityDocument } from '../../../feat/entity/model/entity-document.model'
import { EntityHeaderResource } from '../../../feat/entity/model/entity-header.model'
import { blankEntityRelation } from '../../../feat/entity_relation/model/entity-relation.model'
import { blankUserFavorite } from '../../../feat/preferences/models/user-favorite.model'
import { blankRelation } from '../../../feat/relation/models/relation.model'
import { blankNamespace } from '../../../feat/spaces/model/namespace.model'
import { blankUser } from '../../../feat/user/models/user.model'
import { repoMgr } from './repo-manager.service'

describe('should do thing', () => {
  // let repo = new RepoService()

  before(async () => {
    // Init repo mgr before each test
  })

  after(() => {
    // Dispose repo mgr after each test
  })

  it('should write and retrieve entity header', async () => {
    const entity = await repoMgr.entHeaders.create(new EntityHeaderResource('default', 'name'))
    expect(entity._id).not.undefined
    const retrieve = await repoMgr.entHeaders.findById(entity._id)
    expect(retrieve).not.undefined
  })

  it('should write and retrieve user favorites', async () => {
    const entity = await repoMgr.userFavorites.create(blankUserFavorite)
    expect(entity._id).not.undefined
  })
  it('should write and retrieve entity relations', async () => {
    const entity = await repoMgr.entRelations.create(blankEntityRelation)
    expect(entity._id).not.undefined
  })
  it('should write and retrieve entity classes', async () => {
    const entity = await repoMgr.classes.create(blankEntityClass)
    expect(entity._id).not.undefined
  })
  it('should write and retrieve relations', async () => {
    const entity = await repoMgr.relations.create(blankRelation)
    expect(entity._id).not.undefined
  })
  it('should write and retrieve documents', async () => {
    const entity = await repoMgr.entDocuments.create(blankEntityDocument)
    expect(entity._id).not.undefined
  })
  it('should write and retrieve namespaces', async () => {
    const entity = await repoMgr.namespaces.create(blankNamespace)
    expect(entity._id).not.undefined
  })
  it('should write and retrieve users', async () => {
    const entity = await repoMgr.users.create(blankUser)
    expect(entity._id).not.undefined
  })
})
