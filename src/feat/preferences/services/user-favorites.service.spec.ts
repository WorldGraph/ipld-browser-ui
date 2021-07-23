import { expect } from 'chai'
import { ulid } from 'ulid'

import { repoMgr } from '../../../common/storage/repos/repo-manager.service'
import { UserFavoritesService } from './user-favorites.service'

describe('should do thing', () => {
  // let repo = new RepoService()

  before(async () => {
    // Init repo mgr before each test
    //     await repoMgr.init({ localOnly: true })
  })

  after(() => {
    // Dispose repo mgr after each test
    //     repoMgr.dispose()
  })

  it('should write and retrieve user favorites', async () => {
    const entId = ulid()
    const fav = await UserFavoritesService.createFavorite(entId)
    expect(fav._id).not.undefined
    const retrieve = await UserFavoritesService.getForTargetId(entId)
    expect(retrieve).not.undefined
  })
})
