import { EthereumAuthProvider } from '@3id/connect'

import { PublicID } from './ceramic-public-id'
import { SelfID } from './ceramic-self-id'
import { CeramicWebClient } from './ceramic-web-client'

import type { AlsoKnownAsAccount, BasicProfile } from '@ceramicstudio/idx-constants'
import type { AccountIDParams } from 'caip'
// import { PublicID, SelfID, WebClient } from '../sdk/web'

export type DIDData = {
  profile: BasicProfile | null
  socialAccounts: Array<AlsoKnownAsAccount>
}

export type KnownDID = { accounts: Array<AccountIDParams> }
export type KnownDIDs = Record<string, KnownDID>

export type KnownDIDData = KnownDID & DIDData
export type KnownDIDsData = Record<string, KnownDIDData>

export class CeramicService {
  async authenticate(client: CeramicWebClient, provider: EthereumAuthProvider): Promise<SelfID> {
    const did = await client.authenticate(provider)
    client.ceramic.did = did
    return new SelfID(client, did)
  }

  async loadDIDData(id: PublicID): Promise<DIDData> {
    const [profile, socialAccounts] = await Promise.all([id.getProfile(), id.getSocialAccounts()])
    return { profile, socialAccounts }
  }

  async loadKnownDIDsData(client: CeramicWebClient, knownDIDs: KnownDIDs): Promise<KnownDIDsData> {
    const dids = Object.keys(knownDIDs)
    const results = await Promise.all(
      dids.map(async (id) => await this.loadDIDData(new PublicID(client, id))),
    )
    return dids.reduce((acc, did, i) => {
      acc[did] = { ...results[i], accounts: knownDIDs[did].accounts }
      return acc
    }, {} as KnownDIDsData)
  }

  async editProfile(
    self: SelfID,
    knownDIDs: KnownDIDsData,
    profile: BasicProfile,
  ): Promise<KnownDIDsData> {
    const id = self.id

    const existing = knownDIDs[id]
    if (existing == null) {
      throw new Error(`No associated data for DID ${id}`)
    }

    await self.setProfile(profile)
    return { [id]: { ...existing, profile } }
  }
}
