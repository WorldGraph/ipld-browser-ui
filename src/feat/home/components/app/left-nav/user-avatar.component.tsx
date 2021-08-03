import { Avatar, Button } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import React from 'react'
import { userProfileAtom } from '../../../../user/stores/user-jotai.state'

import { UserDropMenu } from './user-avatar/user-drop-menu.component'

export interface AvatarProps {
  isCollapsed: boolean
  className: string
}

const dropToggleMemory = {
  dropJustToggledOff: false,
}

export function UserAvatar(props: AvatarProps) {
  const userDropRef = React.useRef()
  const [menuVisible, setMenuVisible] = React.useState(false)

  const userProfile = useAtom(userProfileAtom)[0]

  //   const avatarComponent = React.useMemo(() => {
  //     return (
  //       <Avatar size="medium" background="accent-2">
  //         <GrUser color="accent-1" />
  //       </Avatar>
  //     )
  //   }, [userDropRef])

  const avatarComponent = React.useMemo(() => {
    return (
      <Avatar name="Your Name" />
      //       <Avatar size="medium" background="accent-2">
      //         <GrUser color="accent-1" />
      //       </Avatar>
    )
  }, [userDropRef])

  return (
    <UserDropMenu
      userDropRef={userDropRef as any}
      menuVisible={menuVisible as any}
      onClickOutside={(e: React.MouseEvent) => {
        if (!dropToggleMemory.dropJustToggledOff) {
          setMenuVisible(false)
          dropToggleMemory.dropJustToggledOff = true

          // This is a bad hack.  but I can't figure out how to make the onClickOutside from bubbling also
          // to the user button.
          setTimeout(() => {
            dropToggleMemory.dropJustToggledOff = false
          }, 100)
        }
      }}
    >
      <Button
        ref={userDropRef as any}
        className={props.className}
        leftIcon={avatarComponent}
        variant="ghost"
        h="4rem"
        size="lg"
        onClick={(e: React.MouseEvent) => {
          if (menuVisible) return

          if (!dropToggleMemory.dropJustToggledOff) {
            setMenuVisible(true)
          }
        }}
      >
        {props.isCollapsed ? undefined : `${userProfile.firstName} ${userProfile.lastName}`}
      </Button>
    </UserDropMenu>
  )
}
