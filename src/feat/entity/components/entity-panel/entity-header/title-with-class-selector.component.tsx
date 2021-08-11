import { Box, Button, Text } from '@chakra-ui/react'
import { css, cx } from 'emotion'
import { useAtom } from 'jotai'
import React from 'react'
import { GrEdit } from 'react-icons/gr'

import { GenericModal, LockedTextInput } from '../../../../../common/components'
import { ClassSelector } from '../../../../class/components/class-selector.component'
import { userProfileAtom } from '../../../../user/stores/user.state'
import { EntityHeaderService } from '../../../services/entity-header.service'
import { entityClassAtom, entityIdAtom } from '../../../stores/entity.state'

export interface TitleWithClassSelectorProps {
  isEditing: boolean
  title: string
  setTitle: (newtitle: string) => void
  cssClassName: string
  isDeprecated: boolean
}

export function TitleWithClassSelector(props: TitleWithClassSelectorProps) {
  const entityId = useAtom(entityIdAtom)[0]

  const [isEditingClass, setIsEditingClass] = React.useState(false)
  const [selectedClassId, setSelectedClassId] = React.useState('')
  const [selectedClassName, setSelectedClassName] = React.useState('')
  const userProfile = useAtom(userProfileAtom)[0]

  const [entityClass, setEntityClass] = useAtom(entityClassAtom)

  const title = React.useMemo(() => {
    if (!props.isDeprecated) return props.title

    return `${props.title} (MOVED TO TRASH)`
  }, [props.title, props.isDeprecated])

  const updateEntityClass = React.useCallback(
    async (entityId: string, classId: string) => {
      console.log(`updating entity id ${entityId} to class id ${classId}`)
      await EntityHeaderService.updateEntityClass(entityId, classId)
      setIsEditingClass(false)
      setEntityClass({
        ...entityClass,
        name: selectedClassName,
        id: classId,
      } as any)
    },
    [entityClass, selectedClassName, userProfile?.defaultNamespaceId],
  )

  return (
    <Box id="title-with-class-selector" className={cx(props.cssClassName, css``)}>
      {isEditingClass && (
        <GenericModal
          id="edit-class-modal"
          title="Change Item Type"
          cancelCallback={() => {
            setIsEditingClass(false)
          }}
          okCallback={() => {
            if (entityId == null) return

            void updateEntityClass(entityId, selectedClassId)
          }}
          size="xl"
          showCancelButton
        >
          <ClassSelector
            cssClassName={css``}
            setSelectedClassId={(val: string) => {
              setSelectedClassId(val)
            }}
            setSelectedClassName={(val: string) => {
              setSelectedClassName(val)
            }}
            defaultNamespaceId={userProfile.defaultNamespaceId}
            autofocus={true}
          />
        </GenericModal>
      )}
      <LockedTextInput
        containerClassName={css``}
        id="entity-title-input"
        isEditing={props.isEditing}
        value={title}
        setValue={props.setTitle}
        editable
        placeholder="Type Item Title"
      />
      <Box
        className={css`
          padding-left: 11px;
          display: flex;
          flex-direction: row;
        `}
      >
        <Text
          size="large"
          className={css`
            font-style: italic;
            margin-right: 7px;
          `}
        >
          {entityClass.name || 'No type assigned'}
        </Text>
        <Button
          size="small"
          leftIcon={<GrEdit size="18px" />}
          variant="ghost"
          onClick={() => setIsEditingClass(true)}
        ></Button>
      </Box>
    </Box>
  )
}
