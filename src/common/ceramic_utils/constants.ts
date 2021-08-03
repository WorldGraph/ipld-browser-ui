import type { AppNetwork } from './sdk'

export const APP_NETWORK: AppNetwork =
  (process.env.NEXT_PUBLIC_APP_NETWORK as AppNetwork | undefined) ?? ('testnet-clay' as AppNetwork)

console.log(`APP NETWORK IS `, APP_NETWORK)

export const PROFILE_URL = 'https://ipfs.3box.io/profile'
