import './app/app.styles.css'
import './app/spinners.css'

import { ChakraProvider } from '@chakra-ui/react'
import React, { useCallback, useEffect } from 'react'
import { AppDisplayContainer } from './app/app-container.component'
import { LoadingSpinner } from './app/loading-spinner.component'
import { reachNavigate } from '../../../common/util/navigate'
import { UserBasicProfileAtom, userProfileAtom } from '../../user/stores/user.state'
import { useAtom } from 'jotai'
import {
  DecrementWaitersAtom,
  IncrementWaitersAtom,
  WaitersCountAtom,
} from '../../notifications/stores/notification.state'
import { IdxEnvironmentAtom } from '../../../common/ceramic_utils/client/idx.state'
import { useUserLoggedIn } from '../../../common/ceramic_utils/client/hooks/idx-env.hooks'
import { NamespaceService } from '../../namespaces/services/namespace.service'
import {
  CurrentNamespaceIdAtom,
  UserDefaultNamespaceIdAtom,
} from '../../namespaces/stores/namespaces.state'

// theme https://www.canva.com/learn/website-color-schemes/ number 23
// color picker https://www.w3schools.com/colors/colors_picker.asp
export function App(props: { path: string }) {
  const user = useAtom(userProfileAtom)[0]

  const incrementWaiters = useAtom(IncrementWaitersAtom)[1]
  const decrementWaiters = useAtom(DecrementWaitersAtom)[1]
  const numServerWaiters = useAtom(WaitersCountAtom)[0]

  //   const isAuthenticated = useAtom(UserIsAuthenticatedAtom)[0]
  const isLoggedIn = useUserLoggedIn()

  const idxEnv = useAtom(IdxEnvironmentAtom)[0]
  const userProfile = useAtom(UserBasicProfileAtom)[0]
  const setUserDefaultNsId = useAtom(UserDefaultNamespaceIdAtom)[1]
  const [currentNsId, setCurrentNsId] = useAtom(CurrentNamespaceIdAtom)

  useEffect(() => {
    incrementWaiters()
    setTimeout(() => {
      decrementWaiters()
    }, 500)
  }, [])

  useEffect(() => {
    if (!isLoggedIn && !userProfile.name) {
      void reachNavigate('/login')
    }
  }, [isLoggedIn, userProfile])

  useEffect(() => {
    if (isLoggedIn) {
      void initUserDefaultNs()
    }
  }, [isLoggedIn])

  const initUserDefaultNs = useCallback(async () => {
    const ns = await NamespaceService.getOrCreateUserDefaultNs()
    setUserDefaultNsId(ns._id)
    if (!currentNsId) {
      setCurrentNsId(ns._id)
    }
  }, [])

  useEffect(() => {
    void tryGetProfile()
  }, [idxEnv.self?._did])

  const tryGetProfile = useCallback(async () => {
    if (idxEnv.self?._did) {
      const profile = await idxEnv.self?.getProfile()
    }
  }, [])

  useEffect(() => {
    // On startup, refresh indexes
    if (user.defaultNamespaceId) {
      // void IndexStore.GetLatestEntNameIndexes([user.defaultNamespaceId])
      // void IndexStore.GetLatestRelNameIndexes([user.defaultNamespaceId])
      // void IndexStore.GetLatestClsNameIndexes([user.defaultNamespaceId])
    }
  }, [user])

  return (
    <ChakraProvider resetCSS>
      <LoadingSpinner
        opacity={numServerWaiters === 0 ? 0 : 1}
        transition="opacity 1s ease-in-out"
      />
      <AppDisplayContainer />
    </ChakraProvider>
  )
}
