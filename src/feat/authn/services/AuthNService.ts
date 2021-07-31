import { EthereumAuthProvider, ThreeIdConnect } from '@3id/connect'
import { DID } from 'dids'

import { CeramicAccess } from '../../../common/config/ceramic-access'
import { NotImplementedException } from '../../../common/exceptions/not-implemented.exception'
import { reachNavigate } from '../../../common/util/navigate'

// import { ThreeIdConnect, EthereumAuthProvider } from '@3id/connect'
const ceramicAccess = new CeramicAccess('local')

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
      throw new Error(`Ethereum not available in browser!`)
    }

    const addresses = await w.ethereum.enable()

    const threeIdConnect = new ThreeIdConnect()
    const authProvider = new EthereumAuthProvider(w.ethereum, addresses[0])
    await threeIdConnect.connect(authProvider)
    const provider = threeIdConnect.getDidProvider()

    await ceramic.setDID(new DID({ provider }))
    ceramic?.did?.setProvider(provider)
    await ceramic?.did?.authenticate()

    await idx.get('basicProfile')
    authState.loggedIn = true
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
