import {
  FortmaticConnector,
  InjectedConnector,
  PortisConnector,
  TorusConnector,
  WalletConnectConnector,
} from '@ceramicstudio/multiauth'
import type { PartialConnectorConfig } from '@ceramicstudio/multiauth'

export const multiauthConnectors: Array<PartialConnectorConfig> = [
  {
    key: 'injected',
    connector: new InjectedConnector({}),
  },
]

const walletConnectChainId = process.env.NEXT_PUBLIC_WALLETCONNECT_CHAIN_ID
const walletConnectRpcUrl = process.env.NEXT_PUBLIC_WALLETCONNECT_RPC_URL
if (typeof walletConnectChainId === 'string' && typeof walletConnectRpcUrl === 'string') {
  multiauthConnectors.push({
    key: 'walletConnect',
    connector: new WalletConnectConnector({
      rpc: { [walletConnectChainId]: walletConnectRpcUrl },
    }),
  })
}

const fortmaticApiKey = process.env.NEXT_PUBLIC_FORTMATIC_API_KEY
const fortmaticChainId = process.env.NEXT_PUBLIC_FORTMATIC_CHAIN_ID
if (typeof fortmaticApiKey === 'string' && typeof fortmaticChainId === 'string') {
  multiauthConnectors.push({
    key: 'fortmatic',
    connector: new FortmaticConnector({
      apiKey: fortmaticApiKey,
      chainId: parseInt(fortmaticChainId, 10),
    }),
  })
}

const portisDappId = process.env.NEXT_PUBLIC_PORTIS_DAPP_ID
const portisNetworks = process.env.NEXT_PUBLIC_PORTIS_NETWORKS
if (typeof portisDappId === 'string' && typeof portisNetworks === 'string') {
  multiauthConnectors.push({
    key: 'portis',
    connector: new PortisConnector({
      dAppId: portisDappId,
      networks: portisNetworks.split(',').map((v) => parseInt(v, 10)),
    }),
  })
}

const torusChainId = process.env.NEXT_PUBLIC_TORUS_CHAIN_ID
if (typeof torusChainId === 'string') {
  multiauthConnectors.push({
    key: 'torus',
    connector: new TorusConnector({
      chainId: parseInt(torusChainId, 10),
      initOptions: { showTorusButton: false },
    }),
  })
}
