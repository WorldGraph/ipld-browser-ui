import { useMultiAuth } from '@ceramicstudio/multiauth'
import type { AuthAccount } from '@ceramicstudio/multiauth'
import { useCallback } from 'react'
import toast from 'react-hot-toast'

import type { SelfID } from '../../sdk/web'

import { useEnv } from './env'

export function useLogin(): (switchAccount?: boolean) => Promise<SelfID | null> {
  const [authState, connect] = useMultiAuth()
  const [env, tryAuth, resetEnv] = useEnv()

  return useCallback(
    async (switchAccount?: boolean) => {
      console.log(`IN USE CALLBACK IN USE LOGIN`)
      if (
        env.auth.state === 'confirmed' &&
        authState.status === 'connected' &&
        !switchAccount &&
        env.self !== null
      ) {
        console.log(`1`)
        return env.self
      }
      console.log(`1-1`)

      let eth: AuthAccount<'ethereum'> | null = null
      try {
        if (switchAccount) {
          console.log(`1-2`)
          resetEnv()
          console.log(`1-3`)
          eth = await connect({ mode: 'force' })
          console.log(`2`)
        } else {
          console.log(`1-4`)
          eth = await connect({ mode: 'use' })
          console.log(`3`)
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
  const resetEnv = useEnv()[2]

  return useCallback(() => {
    disconnect()
    resetEnv()
  }, [disconnect, resetEnv])
}
