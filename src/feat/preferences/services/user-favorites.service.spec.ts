import { ulid } from 'ulid'

import memoryAdapter from 'pouchdb-adapter-memory'
import { UserFavoritesService } from './user-favorites.service'
import { ConfigService } from '../../../common/config/config.service'

describe('should do thing', () => {
  // let repo = new RepoService()

  beforeAll(() => {
    ConfigService.setUseMemoryAdapter(true)
    PouchDB.plugin(memoryAdapter)
  })

  it('should write and retrieve user favorites', async () => {
    const entId = ulid()
    const fav = await UserFavoritesService.createFavorite(entId)
    expect(fav._id).toBeDefined()
    const retrieve = await UserFavoritesService.getForTargetId(entId)
    expect(retrieve).toBeDefined()
  })
})
