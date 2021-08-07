import { Button } from '@chakra-ui/react'
import React from 'react'
import { NamespaceService } from '../services/namespace.service'
import { SpaceSelectModal } from './space-select-modal.component'
import { css } from 'emotion'
import { GrCube } from 'react-icons/gr'
import { AvailableSpaceIdsAtom, CurrentSpaceAtom, CurrentSpaceIdAtom } from '../stores/spaces.state'
import { useAtom } from 'jotai'

const styleNavlink = css`
  height: 4rem;
  padding: 12px;
  width: 100% !important;
`
const styleNavIcon = css`
  margin-right: 10px;
`
export function SpacesAvatar(props: { isCollapsed: boolean }) {
  const setCurrentSpaceId = useAtom(CurrentSpaceIdAtom)[1]
  const setAvailableSpaceIds = useAtom(AvailableSpaceIdsAtom)[1]
  const currentSpace = useAtom(CurrentSpaceAtom)[0]

  const [spaceSelectOpen, setSpaceSelectOpen] = React.useState(false)

  const getAvailableSpaces = React.useCallback(async () => {
    const res = await NamespaceService.getAvailableForUser()
    setCurrentSpaceId(res[0]?._id || '')
    const spaceIds = res.map((x) => x._id)
    setAvailableSpaceIds(spaceIds)
  }, [])

  React.useEffect(() => {
    void getAvailableSpaces()
  }, [])

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
        {props.isCollapsed ? undefined : currentSpace?.name || '[Space Select]'}
      </Button>
    </>
  )
}
