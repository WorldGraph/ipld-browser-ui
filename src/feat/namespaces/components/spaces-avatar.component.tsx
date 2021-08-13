import { Button } from '@chakra-ui/react'
import { css } from 'emotion'
import { useAtom } from 'jotai'
import React from 'react'
import { GrCube } from 'react-icons/gr'

import { CurrentNamespaceIdAtom, CurrentSpaceDisplayNameAtom } from '../stores/namespaces.state'
import { SpaceSelectModal } from './space-select-modal.component'

const styleNavlink = css`
  height: 4rem;
  padding: 12px;
  width: 100% !important;
`
const styleNavIcon = css`
  margin-right: 10px;
`
export function SpacesAvatar(props: { isCollapsed: boolean }) {
  const setCurrentSpaceId = useAtom(CurrentNamespaceIdAtom)[1]

  const [spaceSelectOpen, setSpaceSelectOpen] = React.useState(false)
  const spaceDisplayName = useAtom(CurrentSpaceDisplayNameAtom)[0]

  return (
    <>
      {spaceSelectOpen && <SpaceSelectModal closeModal={() => setSpaceSelectOpen(false)} />}
      <Button
        marginTop="0.5rem"
        size="large"
        className={styleNavlink}
        leftIcon={<GrCube className={styleNavIcon} size="24px" />}
        onClick={() => setSpaceSelectOpen(true)}
        variant="ghost"
        fill="horizontal"
      >
        {props.isCollapsed ? undefined : spaceDisplayName}
      </Button>
    </>
  )
}
