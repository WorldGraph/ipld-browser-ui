import { Button } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { NamespaceService } from '../services/namespace.service'
import { SpaceSelectModal } from './space-select-modal.component'
import { css } from 'emotion'
import { GrCube } from 'react-icons/gr'
import {
  AvailableSpaceIdsAtom,
  CurrentSpaceAtom,
  CurrentNamespaceIsAtom,
} from '../stores/namespaces.state'
import { useAtom } from 'jotai'
import { getCurrentNode } from '../../entity/components/entity-panel/entity-slate-editor/helpers/liveTypingAnalyzer/getCurrentNode'
import { getLoggedInDID } from '../../../common/ceramic_utils/client/idx.state'

const styleNavlink = css`
  height: 4rem;
  padding: 12px;
  width: 100% !important;
`
const styleNavIcon = css`
  margin-right: 10px;
`
export function SpacesAvatar(props: { isCollapsed: boolean }) {
  const setCurrentSpaceId = useAtom(CurrentNamespaceIsAtom)[1]
  const setAvailableSpaceIds = useAtom(AvailableSpaceIdsAtom)[1]
  const currentSpace = useAtom(CurrentSpaceAtom)[0]
  const currentSpaceId = useAtom(CurrentNamespaceIsAtom)[0]

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

  const spaceName = useMemo(() => {
    console.log(
      `making space name and current space is ${currentSpace}. current ns id is ${currentSpaceId}`,
    )
    if (!currentSpace?.name) return '[Select space]'
    const did = getLoggedInDID()

    if (did === currentSpace.owningUser) {
      return 'My Private Space'
    } else {
      return currentSpace.name
    }
  }, [currentSpace])

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
        {props.isCollapsed ? undefined : spaceName}
      </Button>
    </>
  )
}
