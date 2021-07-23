// const privateKey = PrivateKey.fromRandom()
/**
 * Returns everything necessary to drive app config
 * 1. Auth information
 * 2. Database schema and version information
 */
export class ConfigService {
  static get textileHubKey() {
    // return 'bn6zcf5mzp4mgdcgrulueviflry'
    return localStorage.getItem('textile_hub_key') || ''
  }

  static setTextileHubKey(appKey: string) {
    localStorage.setItem('textile_hub_key', appKey)
  }

  //   static get userPrivateKey(): PrivateKey {
  //     return privateKey
  //   }
}
