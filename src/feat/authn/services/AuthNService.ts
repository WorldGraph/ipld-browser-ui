import { NotImplementedException } from '../../../common/exceptions/not-implemented.exception'
import { reachNavigate } from '../../../common/util/navigate'

// import { ThreeIdConnect, EthereumAuthProvider } from '@3id/connect'

const authState = { loggedIn: false }

export class AuthenticationService {
  static get isLoggedIn() {
    return true
    //     return authState.loggedIn
  }

  static setLoggedIn(isLoggedIn: boolean) {
    authState.loggedIn = isLoggedIn
  }

  static async logout() {
    throw new NotImplementedException('not implemented')
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
