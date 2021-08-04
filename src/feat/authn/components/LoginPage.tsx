import { Box, Button, ChakraProvider, Heading } from '@chakra-ui/react'
import * as Reach from '@reach/router'
import { css } from 'emotion'
import React, { useRef } from 'react'
import { LoadingSpinner } from '../../home/components/app/loading-spinner.component'
import { UserProfileEditModal } from '../../home/components/app/left-nav/user-profile/user-profit-edit-modal.component'
import { UserModel } from '../../user/models/user.model'
import { UserService } from '../../user/services/UserService'

import { GrLogin } from 'react-icons/gr'
import { useLogin } from '../../../common/ceramic_utils/client/hooks'
import { userProfileAtom } from '../../user/stores/user-jotai.state'
import { useAtom } from 'jotai'
import {
  DecrementWaitersAtom,
  IncrementWaitersAtom,
  WaitersCountAtom,
} from '../../notifications/stores/notification-jotai.state'

export interface LoggedOutPageProps {
  path?: string
}

export function LoginPage(props: LoggedOutPageProps) {
  const setUser = useAtom(userProfileAtom)[1]
  const [profileModalOpen, setProfileModalOpen] = React.useState(false)
  const currentUserPk = useRef('')

  const incrementWaiters = useAtom(IncrementWaitersAtom)[1]
  const decrementWaiters = useAtom(DecrementWaitersAtom)[1]
  const numServerWaiters = useAtom(WaitersCountAtom)[0]

  const login = useLogin()

  React.useEffect(() => {
    if (localStorage.getItem('identity') != null) void doLogin()
  }, [])

  const doLogin = React.useCallback(async () => {
    incrementWaiters()
    //     await AuthenticationService.login()
    console.log(`calling login hook`)
    await login()
    decrementWaiters()
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
