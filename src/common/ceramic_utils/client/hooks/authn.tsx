import { useMultiAuth } from '@ceramicstudio/multiauth'
import type { AuthAccount } from '@ceramicstudio/multiauth'
import { useCallback } from 'react'
import toast from 'react-hot-toast'

import type { SelfID } from '../../sdk/web'

import { useIdxEnv } from './idx-env.hooks'

export function useLogin(): (switchAccount?: boolean) => Promise<SelfID | null> {
  const [authState, connect] = useMultiAuth()
  const [env, tryAuth, resetEnv] = useIdxEnv()

  return useCallback(
    async (switchAccount?: boolean) => {
      if (
        env.auth.state === 'confirmed' &&
        authState.status === 'connected' &&
        !switchAccount &&
        env.self !== null
      ) {
        return env.self
      }
      console.log(`1-1`)

      let eth: AuthAccount<'ethereum'> | null = null
      try {
        if (switchAccount) {
          resetEnv()
          eth = await connect({ mode: 'force' })
        } else {
          eth = await connect({ mode: 'use' })
        }
      } catch (err) {
        console.log(`4`)
        console.warn('Failed to login:', err)
        toast.error((err as Error).message ?? 'Failed to connect')
      }

      return eth
        ? await tryAuth(eth.provider.state.provider as any, eth.provider.state.account)
        : null
    },
    [authState, connect, env, resetEnv, tryAuth],
  )
}

export function useLogout() {
  const disconnect = useMultiAuth()[2]
  const resetEnv = useIdxEnv()[2]

  return useCallback(() => {
    disconnect()
    resetEnv()
  }, [disconnect, resetEnv])
}
