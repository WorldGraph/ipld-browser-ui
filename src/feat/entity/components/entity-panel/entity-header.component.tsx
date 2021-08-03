import { Box } from '@chakra-ui/react'
import { css } from 'emotion'
import { useAtom } from 'jotai'
import React from 'react'
import { entityIdAtom, entityIsDeprecatedAtom } from '../../stores/entity-jotai.state'

import { EntityEditButtons } from './entity-header/entity-edit-buttons'
import { TitleWithClassSelector } from './entity-header/title-with-class-selector.component'

export interface EntityHeaderProps {
  createNewEntity: (name: string, callback: (newEntityId: string) => void) => void
  entityName: string
  isEditing: boolean
  isFavorited: boolean
  isUpdating: boolean
  rehydrateEntityFromServer: () => void
  setEntityName: (title: string) => void
  setIsEditing: (isEditing: boolean) => void
  setIsFavorited: (input: boolean) => void
}

export function EntityHeaderComponent(props: EntityHeaderProps) {
  const entityIsDeprecated = useAtom(entityIsDeprecatedAtom)[0]

  const entityId = useAtom(entityIdAtom)[0]

  return (
    <Box
      id="entity-header"
      className={css`
        display: flex;
        flex-direction: row;
        padding: 10px;
        padding-right: 30px;
        padding-top: 25px;
      `}
    >
      <TitleWithClassSelector
        isEditing={props.isEditing}
        cssClassName={css`
          flex: 1 0 30vw;
        `}
        title={props.entityName}
        setTitle={(newName: string) => {
          props.setEntityName(newName)
        }}
        isDeprecated={entityIsDeprecated}
      />
      <Box
        className={css`
          flex: 0 1 50vw;
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
        `}
      >
        <EntityEditButtons
          entId={entityId}
          rehydrateEntityFromServer={props.rehydrateEntityFromServer}
          setIsFavorited={props.setIsFavorited}
          isFavorited={props.isFavorited}
          isEditing={props.isEditing}
          setIsEditing={props.setIsEditing}
          createNewEntity={props.createNewEntity}
          isUpdating={props.isUpdating}
        />
      </Box>
    </Box>
  )
}
