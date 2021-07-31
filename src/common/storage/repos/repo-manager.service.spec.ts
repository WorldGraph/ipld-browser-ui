import PouchDB from 'pouchdb'
import memoryAdapter from 'pouchdb-adapter-memory'
import { ulid } from 'ulid'

import { EntityClassResource } from '../../../feat/class/models/entity-class.model'
import { EntityDocumentResource } from '../../../feat/entity/model/entity-document.model'
import { EntityHeaderResource } from '../../../feat/entity/model/entity-header.model'
import { EntityRelationResource } from '../../../feat/entity_relation/model/entity-relation.model'
import { UserFavoriteResource } from '../../../feat/preferences/models/user-favorite.model'
import { UserFavoriteType } from '../../../feat/preferences/models/UserFavoriteType'
import { RelationResource } from '../../../feat/relation/models/relation.model'
import { NamespaceResource } from '../../../feat/spaces/model/namespace.model'
import { UserResource } from '../../../feat/user/models/user.model'
import { ConfigService } from '../../config/config.service'
import { repoMgr } from './repo-manager.service'

describe('repo manager should operate', () => {
  // let repo = new RepoService()

  beforeAll(() => {
    ConfigService.setUseMemoryAdapter(true)
    PouchDB.plugin(memoryAdapter)
  })

  it('should write and retrieve entity header', async () => {
    const entity = await repoMgr.entHeaders.create(new EntityHeaderResource('default', 'name'))
    expect(entity._id).toBeDefined()
    const retrieve = await repoMgr.entHeaders.findById(entity._id)
    expect(retrieve).toBeDefined()
  })

  it('should write and retrieve user favorites', async () => {
    const entity = await repoMgr.userFavorites.create(
      new UserFavoriteResource(ulid(), UserFavoriteType.Entity),
    )
    expect(entity._id).toBeDefined()

    const retrieve = await repoMgr.userFavorites.findById(entity._id)
    expect(retrieve).toBeDefined()
  })
  it('should write and retrieve entity relations', async () => {
    const entity = await repoMgr.entRelations.create(
      new EntityRelationResource(ulid(), ulid(), ulid()),
    )
    expect(entity._id).toBeDefined()

    const retrieve = await repoMgr.entRelations.findById(entity._id)
    expect(retrieve).toBeDefined()
  })
  it('should write and retrieve entity classes', async () => {
    const entity = await repoMgr.classes.create(new EntityClassResource('name', 'namespaceid'))
    expect(entity._id).toBeDefined()

    const retrieve = await repoMgr.classes.findById(entity._id)
    expect(retrieve).toBeDefined()
  })
  it('should write and retrieve relations', async () => {
    const entity = await repoMgr.relations.create(new RelationResource('namespaceid', 'name'))
    expect(entity._id).toBeDefined()

    const retrieve = await repoMgr.relations.findById(entity._id)
    expect(retrieve).toBeDefined()
  })
  it('should write and retrieve documents', async () => {
    const entity = await repoMgr.entDocuments.create(new EntityDocumentResource('docjson'))
    expect(entity._id).toBeDefined()

    const retrieve = await repoMgr.entDocuments.findById(entity._id)
    expect(retrieve).toBeDefined()
  })
  it('should write and retrieve namespaces', async () => {
    const entity = await repoMgr.namespaces.create(new NamespaceResource('namespace', 'owninguser'))
    expect(entity._id).toBeDefined()

    const retrieve = await repoMgr.namespaces.findById(entity._id)
    expect(retrieve).toBeDefined()
  })
  it('should write and retrieve users', async () => {
    const entity = await repoMgr.users.create(
      new UserResource(
        'publickey',
        'username',
        'email',
        'firstname',
        'lastName',
        'defaultnamespaceid',
      ),
    )
    expect(entity._id).toBeDefined()

    const retrieve = await repoMgr.users.findById(entity._id)
    expect(retrieve).toBeDefined()
  })
})
