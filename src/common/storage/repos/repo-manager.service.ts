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
import { Repository } from '../generics/repository.generic-class'

export interface RepoConfigOptions {
  localOnly?: boolean
}

export class RepoService {
  private _users?: Repository<UserModel>
  private _entHeaders?: Repository<EntityHeader>
  private _entRelations?: Repository<EntityRelation>
  private _classes?: Repository<EntityClass>
  private _relations?: Repository<Relation>
  private _entDocuments?: Repository<EntityDocument>
  private _namespaces?: Repository<Namespace>
  private _userFavorites?: Repository<UserFavorite>
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

  public get entHeaders(): Repository<EntityHeader> {
    if (this._entHeaders == null) {
      this._entHeaders = new Repository(EntityHeaderSchema, CollectionNames.EntityHeader)
    }
    return this._entHeaders
  }

  public get userFavorites(): Repository<UserFavorite> {
    if (this._userFavorites == null) {
      this._userFavorites = new Repository(UserFavoriteSchema, CollectionNames.UserFavorite)
    }
    return this._userFavorites
  }
  public get entRelations(): Repository<EntityRelation> {
    if (this._entRelations == null) {
      this._entRelations = new Repository(EntityRelationSchema, CollectionNames.EntityRelation)
    }
    return this._entRelations
  }
  public get classes(): Repository<EntityClass> {
    if (this._classes == null) {
      this._classes = new Repository(EntityClassSchema, CollectionNames.EntityRelation)
    }
    return this._classes
  }
  public get relations(): Repository<Relation> {
    if (this._relations == null) {
      this._relations = new Repository(RelationSchema, CollectionNames.Relation)
    }
    return this._relations
  }
  public get entDocuments(): Repository<EntityDocument> {
    if (this._entDocuments == null) {
      this._entDocuments = new Repository(EntityDocumentSchema, CollectionNames.EntityDocument)
    }
    return this._entDocuments
  }
  public get namespaces(): Repository<Namespace> {
    if (this._namespaces == null) {
      this._namespaces = new Repository(NamespaceSchema, CollectionNames.Namespace)
    }
    return this._namespaces
  }

  public get users(): Repository<UserModel> {
    if (this._users == null) {
      this._users = new Repository(UserSchema, CollectionNames.User)
    }
    return this._users
  }

  public async init() {
    await this.entRelations.createIndexes(EntityRelationIndexedFields)
    await this.userFavorites.createIndexes(UserFavoriteIndexedFields)
  }
}

export const repoMgr = new RepoService()
