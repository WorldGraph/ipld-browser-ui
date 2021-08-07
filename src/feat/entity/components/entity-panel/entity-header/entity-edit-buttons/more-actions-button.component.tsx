import { Button } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import React from 'react'
import { GrMore, GrTrash } from 'react-icons/gr'

import {
  ConfirmModal,
  DropMenuItemProps,
  dropToggleMemory,
  GenericDropMenu,
  setDropToggleMemoryTimer,
} from '../../../../../../common/components'
import { userProfileAtom } from '../../../../../user/stores/user.state'
import { setEntityDeprecated } from '../../../../dal/entityDal'
import { entityIdAtom } from '../../../../stores/entity-jotai.state'

export interface MoreActionsButtonProps {
  className: string
}

export function MoreActionsButton(props: MoreActionsButtonProps) {
  const dropRef = React.useRef()
  const [dropVisible, setDropVisible] = React.useState(false)
  const [deprecateModalOpen, setDeprecateModalOpen] = React.useState(false)
  //   const entityId = useEntityStore(entityStoreSelectors.entityId)
  const userProfile = useAtom(userProfileAtom)[0]

  const entityId = useAtom(entityIdAtom)[0]

  const dropItems = React.useMemo<DropMenuItemProps[]>(() => {
    return [
      {
        label: 'Move to Trash',
        icon: <GrTrash />,
        action: () => {
          setDeprecateModalOpen(true)
        },
      },
    ]
  }, [])

  const deprecateEntity = React.useCallback(
    async (pEntityId: string) => {
      await setEntityDeprecated(pEntityId, true, userProfile.defaultNamespaceId)
      setDeprecateModalOpen(false)
    },
    [userProfile.defaultNamespaceId],
  )

  return (
    <>
      {deprecateModalOpen && (
        <ConfirmModal
          id="deprecate-confirm-modal"
          heading="Confirm Deletion?"
          description="Are you sure you want to move this item to the trash?"
          okCallback={() => {
            if (entityId == null) return
            void deprecateEntity(entityId)
          }}
          cancelCallback={() => {
            setDeprecateModalOpen(false)
          }}
        />
      )}
      <GenericDropMenu
        closeMenu={() => setDropVisible(false)}
        anchorRef={dropRef as any}
        items={dropItems}
        visible={dropVisible}
      />
      <Button
        ref={dropRef as any}
        className={props.className}
        onClick={(e) => {
          if (dropToggleMemory.justToggledOff) return
          setDropToggleMemoryTimer()
          e.stopPropagation()
          setDropVisible(!dropVisible)
        }}
        leftIcon={<GrMore />}
      >
        More
      </Button>
    </>
  )
}
