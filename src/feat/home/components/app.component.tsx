import './app/app.styles.css'
import './app/spinners.css'

import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import {
  notifMutators,
  notifSelectors,
  useNotificationStore,
} from '../../notifications/stores/notification.store'
import { AppDisplayContainer } from './app/app-container.component'
import { LoadingSpinner } from './app/loading-spinner.component'
import { AuthenticationService } from '../../authn/services/AuthNService'
import { reachNavigate } from '../../../common/util/navigate'
import { userProfileAtom } from '../../user/stores/user-jotai.state'
import { useAtom } from 'jotai'

// theme https://www.canva.com/learn/website-color-schemes/ number 23
// color picker https://www.w3schools.com/colors/colors_picker.asp
export function App(props: { path: string }) {
  const numServerWaiters = useNotificationStore(notifSelectors.numWaiters)

  const user = useAtom(userProfileAtom)[0]
  const incrementWaiters = useNotificationStore(notifMutators.incrementWaiters)
  const decrementWaiters = useNotificationStore(notifMutators.decrementWaiters)

  React.useEffect(() => {
    incrementWaiters()
    setTimeout(() => {
      decrementWaiters()
    }, 500)
  }, [])

  React.useEffect(() => {
    if (!AuthenticationService.isLoggedIn) {
      void reachNavigate('/login')
    }
  }, [])

  React.useEffect(() => {
    // On startup, refresh indexes
    if (user.defaultNamespaceId !== null && user.defaultNamespaceId !== '') {
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
