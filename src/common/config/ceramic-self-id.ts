import type { EthereumAuthProvider } from '@3id/connect'
import type { AlsoKnownAsAccount, BasicProfile } from '@ceramicstudio/idx-constants'
import { DID } from 'dids'
import { Identifyable } from './ceramic-public-id'

import { CeramicWebClient } from './ceramic-web-client'
import { AppNetwork } from './ceramic.types'

export class SelfID implements Identifyable {
  static async authenticate(
    network: AppNetwork,
    authProvider: EthereumAuthProvider,
  ): Promise<SelfID> {
    const client = new CeramicWebClient(network)
    const did = await client.authenticate(authProvider, true)
    return new SelfID(client, did)
  }

  _client: CeramicWebClient
  _did: DID

  constructor(client: CeramicWebClient, did: DID) {
    if (!did.authenticated) {
      throw new Error(
        'Input DID must be authenticated, use SelfID.authenticate() instead of new SelfID()',
      )
    }
    if (client._config.verificationsServer == null) {
      throw new Error('Missing verifications server URL in config')
    }

    this._client = client
    this._did = did
  }

  get client(): CeramicWebClient {
    return this._client
  }

  get id() {
    return this._did.id
  }

  // Definitions interactions

  async getAlsoKnownAs() {
    return await this._client.getAlsoKnownAs(this._did.id)
  }

  async getSocialAccounts(): Promise<Array<AlsoKnownAsAccount>> {
    const aka = await this.getAlsoKnownAs()
    return aka?.accounts ?? []
  }

  async setAlsoKnownAsAccounts(accounts: Array<AlsoKnownAsAccount>): Promise<void> {
    await this._client.idx.set('alsoKnownAs', { accounts })
  }

  async getProfile() {
    return await this._client.getProfile(this._did.id)
  }

  async setProfile(profile: BasicProfile): Promise<void> {
    await this._client.idx.set('basicProfile', profile)
  }

  // Social accounts verifications
}
