import { EthereumAuthProvider } from '@3id/connect'

import { CeramicService } from '../../../common/config/ceramic-env'
import { CeramicWebClient } from '../../../common/config/ceramic-web-client'
import { NotImplementedException } from '../../../common/exceptions/not-implemented.exception'
import { reachNavigate } from '../../../common/util/navigate'

// import { ThreeIdConnect, EthereumAuthProvider } from '@3id/connect'
const ceramicService = new CeramicService()
const webClient = new CeramicWebClient('local')

const authState = { loggedIn: false }

export class AuthenticationService {
  static get isLoggedIn() {
    return authState.loggedIn
  }

  static async logout() {
    throw new NotImplementedException('not implemented')
  }

  static async login() {
    const w = window as any
    if (!w.ethereum) {
      throw new Error(`Ethereum not available in this browser!`)
    }
    const addresses = await w.ethereum.enable()
    const ethProvider = new EthereumAuthProvider(w.ethereum, addresses[0])
    await ceramicService.authenticate(webClient, ethProvider)
  }

  static SaveRouteState = () => {
    console.log(`saving path ${window.location.pathname}`)
    sessionStorage.setItem('route-state', window.location.pathname)
  }

  static NavigateToPreviousRoute = async () => {
    const state = sessionStorage.getItem('route-state')
    if (state == null) {
      await reachNavigate('/')
    } else {
      await reachNavigate(window.location.origin + state)
    }
  }
}
