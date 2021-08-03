import { Box, Button, Flex, Spacer } from '@chakra-ui/react'
import { css } from 'emotion'
import React from 'react'
import { BiWorld } from 'react-icons/bi'
import {
  GrContract,
  GrCube,
  GrExpand,
  GrHelp,
  GrHome,
  GrProjects,
  GrSearch,
  GrSettingsOption,
} from 'react-icons/gr'

import { navigateWithCtrlSensitivity } from '../../../../common/util/navigate'
import { EntitySearchModal } from '../../../entity/components/entity-search-modal.component'
import { UserAvatar } from './left-nav/user-avatar.component'

export const styleNavlink = css`
  height: 4rem;
  padding: 12px;
  width: 100% !important;
`
export const styleNavIcon = css`
  margin-right: 10px;
`

export interface NavStripProps {
  gridArea: string
  id: string
}
export function LeftNav(props: NavStripProps) {
  const [showSearchModal, setShowSearchModal] = React.useState(false)
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const homeRef = React.useRef()

  const sidebarWidth = React.useMemo(() => {
    return isCollapsed ? '70px' : '200px'
  }, [isCollapsed])

  const toggleExpandButton = React.useMemo(() => {
    return (
      <Button
        variant="ghost"
        className={styleNavlink}
        leftIcon={
          isCollapsed ? (
            <GrExpand className={styleNavIcon} />
          ) : (
            <GrContract className={styleNavIcon} />
          )
        }
        onClick={() => setIsCollapsed(!isCollapsed)}
        fill="horizontal"
        size="lg"
      >
        {isCollapsed ? undefined : 'Collapse'}
      </Button>
    )
  }, [isCollapsed])

  return (
    <Box id="left-nav" backgroundColor="teal.200" width={sidebarWidth}>
      <Flex id="buttons" direction="column" marginTop="0rem" height="100vh">
        <Box>
          <Button
            variant="ghost"
            size="large"
            id="worldgraph-btn"
            className={styleNavlink}
            leftIcon={<BiWorld className={styleNavIcon} size="24px" />}
            onClick={(e) => navigateWithCtrlSensitivity('/', e)}
            ref={homeRef as any}
          >
            {isCollapsed ? undefined : 'Worldgraph'}
          </Button>
          {/* <SpacesAvatar isCollapsed={isCollapsed} /> */}
          <Button
            marginTop="3rem"
            variant="ghost"
            size="large"
            id="home-btn"
            className={styleNavlink}
            leftIcon={<GrHome className={styleNavIcon} size="24px" />}
            onClick={(e) => navigateWithCtrlSensitivity('/', e)}
            ref={homeRef as any}
          >
            {isCollapsed ? undefined : 'Home'}
          </Button>
          <Button
            variant="ghost"
            size="large"
            id="search-btn"
            className={styleNavlink}
            onClick={() => setShowSearchModal(true)}
            leftIcon={<GrSearch className={styleNavIcon} size="24px" />}
          >
            {isCollapsed ? undefined : 'Search'}
          </Button>
          <Button
            variant="ghost"
            id="items-btn"
            size="large"
            className={styleNavlink}
            onClick={(e) => navigateWithCtrlSensitivity('/item', e)}
            leftIcon={<GrProjects className={styleNavIcon} size="24px" />}
          >
            {isCollapsed ? undefined : 'Items'}
          </Button>
          <Button
            id="space-select-btn"
            variant="ghost"
            size="large"
            className={styleNavlink}
            onClick={() => {}}
            leftIcon={<GrCube className={styleNavIcon} size="24px" />}
          >
            {isCollapsed ? undefined : 'Spaces'}
          </Button>
          <Button
            id="admin-btn"
            variant="ghost"
            size="large"
            className={styleNavlink}
            onClick={(e) => navigateWithCtrlSensitivity('/admin', e)}
            leftIcon={<GrSettingsOption className={styleNavIcon} size="24px" />}
          >
            {isCollapsed ? undefined : 'Admin'}
          </Button>
          <Button
            id="help-btn"
            variant="ghost"
            size="large"
            className={styleNavlink}
            leftIcon={<GrHelp className={styleNavIcon} size="24px" />}
            marginBottom="5rem"
          >
            {isCollapsed ? undefined : 'Help'}
          </Button>
        </Box>
        <Spacer />
        <UserAvatar className={styleNavlink} isCollapsed={isCollapsed} />
        {toggleExpandButton}
      </Flex>
      {showSearchModal && <EntitySearchModal onClose={() => setShowSearchModal(false)} />}
    </Box>
  )
}
