import {
  Box,
  Button,
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
import { userProfileAtom } from '../../../../../user/stores/user-jotai.state'

import { UserProfileEditModal } from '../user-profile/user-profit-edit-modal.component'

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
        <PopoverContent>
          <PopoverBody>
            {editingProfile && (
              <UserProfileEditModal
                okCallback={(user: UserModel) => {
                  void persistUser(user)
                  setUser(user)
                  setEditingProfile(false)
                }}
                cancelCallback={() => setEditingProfile(false)}
              />
            )}
            <Box>
              <Button
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
                Edit Profile
              </Button>
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}
