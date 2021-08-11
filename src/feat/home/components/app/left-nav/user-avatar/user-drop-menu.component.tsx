import {
  Box,
  Button,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from '@chakra-ui/react'
import * as Reach from '@reach/router'
import { useAtom } from 'jotai'
import React from 'react'
import { GrLogout, GrUserSettings } from 'react-icons/gr'
import { NotImplementedException } from '../../../../../../common/exceptions/not-implemented.exception'
import { AuthenticationService } from '../../../../../authn/services/AuthNService'
import { UserModel } from '../../../../../user/models/user.model'
import { userProfileAtom } from '../../../../../user/stores/user.state'

import { UserProfileEditModal } from '../user-profile/user-profile-edit-modal.component'

export interface UserDropMenuProps {
  userDropRef: any
  menuVisible: boolean
  onClickOutside: (e: React.MouseEvent) => void
  children: React.ReactNode
}

export function UserDropMenu(props: UserDropMenuProps) {
  const [editingProfile, setEditingProfile] = React.useState(false)
  const setUser = useAtom(userProfileAtom)[1]

  const persistUser = React.useCallback(async (user: UserModel) => {
    throw new NotImplementedException('Method')
    // await repoMgr.users.updateOne(user)
  }, [])

  return (
    <Popover id="user-menu-drop" initialFocusRef={props.userDropRef.current} placement="right">
      <PopoverTrigger>{props.children}</PopoverTrigger>
      <Portal>
        <PopoverContent maxWidth="15rem">
          <PopoverBody>
            {editingProfile && (
              <UserProfileEditModal closeCallback={() => setEditingProfile(false)} />
            )}
            <Flex direction="column">
              <Button
                marginBottom="10px"
                leftIcon={<GrLogout />}
                onClick={() => {
                  void AuthenticationService.logout()
                  void Reach.navigate('/comeagain')
                }}
              >
                Logout
              </Button>
              <Button
                leftIcon={<GrUserSettings />}
                onClick={() => {
                  setEditingProfile(true)
                }}
              >
                View / Edit Profile
              </Button>
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}
