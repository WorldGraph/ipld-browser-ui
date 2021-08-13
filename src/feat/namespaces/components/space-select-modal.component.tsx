import { Button, Text } from '@chakra-ui/react'
import { css } from 'emotion'
import { useAtom } from 'jotai'
import React from 'react'
import { GrAdd } from 'react-icons/gr'

import { GenericModal } from '../../../common/components'
import { Namespace } from '../model/namespace.model'
import { NamespaceService } from '../services/namespace.service'
import {
  AvailableSpacesAtom,
  CurrentSpaceAtom,
  CurrentSpaceDisplayNameAtom,
  SelectedSpaceIdsAtom,
  SelectedSpacesAtom,
} from '../stores/namespaces.state'
import { SpaceEditModal } from './space-edit-modal.component'

export interface SpaceSelectModalProps {
  closeModal: () => void
}

export function SpaceSelectModal(props: SpaceSelectModalProps) {
  const selectedSpaces = useAtom(SelectedSpacesAtom)[0]
  const setSelectedSpaceIds = useAtom(SelectedSpaceIdsAtom)[0]
  const currentSpace = useAtom(CurrentSpaceAtom)[0]
  const availableSpaces = useAtom(AvailableSpacesAtom)[0]
  const currentSpaceDisplayName = useAtom(CurrentSpaceDisplayNameAtom)[0]

  const [nsEditOpen, setNsEditOpen] = React.useState(false)

  return (
    <>
      {nsEditOpen && (
        <SpaceEditModal
          okCallback={async (ns: Namespace) => {
            await NamespaceService.createNamespace(ns.name, ns.owningUser)
            setNsEditOpen(false)
          }}
          cancelCallback={() => {
            setNsEditOpen(false)
          }}
        />
      )}
      <GenericModal
        okCallback={props.closeModal}
        cancelCallback={props.closeModal}
        size="2xl"
        title="Space Selection"
      >
        <Text>Current Space: {currentSpaceDisplayName}</Text>
        <Text>Available spaces ({availableSpaces.length}):</Text>
        {availableSpaces.map((space) => (
          <Text key={space._id}>{space.name}</Text>
        ))}
        <Button
          leftIcon={<GrAdd size="24px" />}
          className={css`
            width: 15rem;
          `}
          onClick={() => {
            setNsEditOpen(true)
          }}
        >
          New Space
        </Button>
      </GenericModal>
    </>
  )
}
