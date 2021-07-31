import { ConfigService } from '../../../common/config/config.service'
import { EntityHeaderService } from './entity-header.service'
import memoryAdapter from 'pouchdb-adapter-memory'

describe('should do thing', () => {
  // let repo = new RepoService()
  beforeAll(() => {
    ConfigService.setUseMemoryAdapter(true)
    PouchDB.plugin(memoryAdapter)
  })
  it('should write and retrieve entity header', async () => {
    const entity = await EntityHeaderService.createEntity('name', 'namespace')
    expect(entity._id).toBeDefined()
    const retrieve = await EntityHeaderService.getEntityHeader(entity._id)
    expect(retrieve).toBeDefined()
  })
})
