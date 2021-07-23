import { Box, Button, ChakraProvider, Heading } from '@chakra-ui/react'
import * as Reach from '@reach/router'
import { css } from 'emotion'
import React, { useRef } from 'react'
import { repoMgr } from '../../../common/storage/repos/repo-manager.service'
import { LoadingSpinner } from '../../home/components/app/loading-spinner.component'
import { UserProfileEditModal } from '../../home/components/app/left-nav/user-profile/user-profit-edit-modal.component'
import {
  notifMutators,
  notifSelectors,
  useNotificationStore,
} from '../../notifications/stores/NotificationStore'
import { UserModel } from '../../user/models/user.model'
import { UserService } from '../../user/services/UserService'
import { userStoreMutators, useUserStore } from '../../user/stores/UserStore'

import { AuthNService } from '../services/AuthNService'
import { GrLogin } from 'react-icons/gr'

export interface LoggedOutPageProps {
  path?: string
}

export function LoginPage(props: LoggedOutPageProps) {
  const setUser = useUserStore(userStoreMutators.setUser)
  const [profileModalOpen, setProfileModalOpen] = React.useState(false)
  const currentUserPk = useRef('')
  const incrementWaiters = useNotificationStore(notifMutators.incrementWaiters)
  const decrementWaiters = useNotificationStore(notifMutators.decrementWaiters)
  const resetWaiters = useNotificationStore(notifMutators.resetWaiters)
  const numServerWaiters = useNotificationStore(notifSelectors.numWaiters)

  React.useEffect(() => {
    if (localStorage.getItem('identity') != null) void doLogin()
  }, [])

  const doLogin = React.useCallback(async () => {
    incrementWaiters()
    //     await repoMgr.initCollections()
    //     const existingUser = await UserService.getUserByPublicKey(userPublicKey)

    //     if (existingUser != null) {
    //       setUser(existingUser)
    //       resetWaiters()
    //       void AuthNService.NavigateToPreviousRoute()
    //     } else {
    //       currentUserPk.current = userPublicKey
    //       decrementWaiters()
    //       setProfileModalOpen(true)
    //     }
  }, [])

  const saveUser = React.useCallback(async (user: UserModel) => {
    await UserService.createUser(user)
    setProfileModalOpen(false)
    void Reach.navigate('/')
  }, [])

  return (
    <ChakraProvider resetCSS>
      <LoadingSpinner
        opacity={numServerWaiters === 0 ? 0 : 1}
        transition="opacity 1s ease-in-out"
      />
      {profileModalOpen && (
        <UserProfileEditModal
          okCallback={(user: UserModel) => {
            user.publicKey = currentUserPk.current
            void saveUser(user)
            setProfileModalOpen(false)
          }}
          cancelCallback={() => {
            setProfileModalOpen(false)
          }}
        />
      )}
      <Box
        className={css`
          max-width: 500px;
          margin: 0 auto;
          margin-top: 20vh;
        `}
      >
        <Heading>Welcome to Worldgraph</Heading>
        <Box
          className={css`
            width: 10rem;
          `}
        >
          <Button
            leftIcon={<GrLogin />}
            onClick={() => {
              void doLogin()
            }}
          >
            Log in
          </Button>
        </Box>
      </Box>
    </ChakraProvider>
  )
}
