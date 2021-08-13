import { EntityClass } from '../../../feat/class/models/entity-class.model'
import { EntityClassSchema } from '../../../feat/class/textileSchemas/entity-class.schema'
import { EntityDocument } from '../../../feat/entity/model/entity-document.model'
import { EntityHeader } from '../../../feat/entity/model/entity-header.model'
import { EntityDocumentSchema } from '../../../feat/entity/textileSchemas/entity-document.schema'
import { EntityHeaderSchema } from '../../../feat/entity/textileSchemas/entity-header.schema'
import {
  EntityRelationIndexedFields,
  EntityRelationSchema,
} from '../../../feat/entity/textileSchemas/entity-relation.schema'
import { EntityRelation } from '../../../feat/entity_relation/model/entity-relation.model'
import {
  UserFavoriteIndexedFields,
  UserFavoriteSchema,
} from '../../../feat/preferences/jsonSchemas/user-favorite.schema'
import { UserFavorite } from '../../../feat/preferences/models/user-favorite.model'
import { Relation } from '../../../feat/relation/models/relation.model'
import { RelationSchema } from '../../../feat/relation/textileSchemas/relation.schema'
import { Namespace } from '../../../feat/namespaces/model/namespace.model'
import { NamespaceSchema } from '../../../feat/namespaces/textileSchemas/NamespaceSchema'
import { UserModel } from '../../../feat/user/models/user.model'
import { UserSchema } from '../../../feat/user/textileSchemas/user.schema'
import { sleep } from '../../util/sleep'
import { CollectionNames } from '../enums/collection-names.enum'
import { PouchRepository } from '../generics/repository.generic-class'

export interface RepoConfigOptions {
  localOnly?: boolean
}

export class RepoService {
  private _users?: PouchRepository<UserModel>
  private _entHeaders?: PouchRepository<EntityHeader>
  private _entRelations?: PouchRepository<EntityRelation>
  private _classes?: PouchRepository<EntityClass>
  private _relations?: PouchRepository<Relation>
  private _entDocuments?: PouchRepository<EntityDocument>
  private _namespaces?: PouchRepository<Namespace>
  private _userFavorites?: PouchRepository<UserFavorite>
  private _initialized = false

  constructor() {}

  public get isInitialized(): boolean {
    return this._initialized
  }

  /**
   * Sleep until db is ready
   */
  public awaitInitialized = async (maxWaitMs = 5000) => {
    // todo - reevaluate need to await init
    return
    if (this.isInitialized) return
    const msWaitIntervalMs = 50
    const tries = Math.floor(maxWaitMs / msWaitIntervalMs)
    for (let i = 0; i < tries; i++) {
      await sleep(msWaitIntervalMs)
      if (this.isInitialized) return
    }

    throw new Error('Timed out waiting for repo manager to initialize')
  }

  public get entHeaders(): PouchRepository<EntityHeader> {
    if (this._entHeaders == null) {
      this._entHeaders = new PouchRepository(EntityHeaderSchema, CollectionNames.EntityHeader)
    }
    return this._entHeaders
  }

  public get userFavorites(): PouchRepository<UserFavorite> {
    if (this._userFavorites == null) {
      this._userFavorites = new PouchRepository(UserFavoriteSchema, CollectionNames.UserFavorite)
    }
    return this._userFavorites
  }
  public get entRelations(): PouchRepository<EntityRelation> {
    if (this._entRelations == null) {
      this._entRelations = new PouchRepository(EntityRelationSchema, CollectionNames.EntityRelation)
    }
    return this._entRelations
  }
  public get classes(): PouchRepository<EntityClass> {
    if (this._classes == null) {
      this._classes = new PouchRepository(EntityClassSchema, CollectionNames.EntityRelation)
    }
    return this._classes
  }
  public get relations(): PouchRepository<Relation> {
    if (this._relations == null) {
      this._relations = new PouchRepository(RelationSchema, CollectionNames.Relation)
    }
    return this._relations
  }
  public get entDocuments(): PouchRepository<EntityDocument> {
    if (this._entDocuments == null) {
      this._entDocuments = new PouchRepository(EntityDocumentSchema, CollectionNames.EntityDocument)
    }
    return this._entDocuments
  }
  public get namespaces(): PouchRepository<Namespace> {
    if (this._namespaces == null) {
      this._namespaces = new PouchRepository(NamespaceSchema, CollectionNames.Namespace)
    }
    return this._namespaces
  }

  public get users(): PouchRepository<UserModel> {
    if (this._users == null) {
      this._users = new PouchRepository(UserSchema, CollectionNames.User)
    }
    return this._users
  }

  public async init() {
    await this.entRelations.createIndexes(EntityRelationIndexedFields)
    await this.userFavorites.createIndexes(UserFavoriteIndexedFields)
  }
}

export const repoMgr = new RepoService()
