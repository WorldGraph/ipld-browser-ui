import { reachNavigate } from '../../../common/util/navigate'
import { ThreeIdConnect, EthereumAuthProvider } from '@3id/connect'
import CeramicClient from '@ceramicnetwork/http-client'
import { ConfigService } from '../../../common/config/config.service'

export const ceramic = new CeramicClient(ConfigService.getConfig().ceramicHost)

export class AuthenticationService {
  static async authenticate() {
    const w = window as any

    if (!w.ethereum) {
      throw new Error(`Ethereum not available in browser!`)
    }

    const addresses = await w.ethereum.enable()

    const threeIdConnect = new ThreeIdConnect()
    const authProvider = new EthereumAuthProvider(w.ethereum, addresses[0])
    await threeIdConnect.connect(authProvider)
    const provider = threeIdConnect.getDidProvider()
    ceramic.did.setProvider(provider)
    await ceramic.did.authenticate()
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
