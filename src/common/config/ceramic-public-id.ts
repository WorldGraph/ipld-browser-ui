import { CeramicAccess } from './ceramic-access'

import type { AlsoKnownAsAccount, BasicProfile } from '@ceramicstudio/idx-constants'

export type Identifyable = {
  id: string
  getProfile(): Promise<BasicProfile | null>
  getSocialAccounts(): Promise<Array<AlsoKnownAsAccount>>
}

export class PublicID implements Identifyable {
  _core: CeramicAccess
  _id: string

  constructor(core: CeramicAccess, id: string) {
    this._core = core
    this._id = id
  }

  get id() {
    return this._id
  }

  async getAlsoKnownAs() {
    return await this._core.getAlsoKnownAs(this._id)
  }

  async getSocialAccounts() {
    const aka = await this.getAlsoKnownAs()
    return aka?.accounts ?? []
  }

  async getProfile() {
    return await this._core.getProfile(this._id)
  }
}
