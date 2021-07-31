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
import React from 'react'
import { GrLogout, GrUserSettings } from 'react-icons/gr'
import { NotImplementedException } from '../../../../../../common/exceptions/not-implemented.exception'
import { blankUser, UserModel } from '../../../../../user/models/user.model'
import {
  userStoreMutators,
  userStoreSelectors,
  useUserStore,
} from '../../../../../user/stores/UserStore'

import { UserProfileEditModal } from '../user-profile/user-profit-edit-modal.component'

export interface UserDropMenuProps {
  userDropRef: any
  menuVisible: boolean
  onClickOutside: (e: React.MouseEvent) => void
  children: React.ReactNode
}

export function UserDropMenu(props: UserDropMenuProps) {
  const user = useUserStore(userStoreSelectors.user)
  const setUser = useUserStore(userStoreMutators.setUser)
  const [editingProfile, setEditingProfile] = React.useState(false)

  const logoutOnServer = React.useCallback(async () => {
    localStorage.removeItem('identity')
    setUser(blankUser)
    void Reach.navigate('/comeagain')
  }, [])

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
                  throw new NotImplementedException('Method')
                  void logoutOnServer()
                }}
              >
                Logout
              </Button>
              <Button
                leftIcon={<GrUserSettings />}
                onClick={() => {
                  throw new NotImplementedException('Method')
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
