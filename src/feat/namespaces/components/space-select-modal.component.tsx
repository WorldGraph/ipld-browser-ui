import {
  Button,
  Text,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Flex,
  Spacer,
} from '@chakra-ui/react'
import { css } from 'emotion'
import { useAtom } from 'jotai'
import React from 'react'
import { GrAdd, GrSecure } from 'react-icons/gr'

import { GenericModal } from '../../../common/components'
import { Namespace } from '../model/namespace.model'
import { NamespaceService } from '../services/namespace.service'
import {
  AvailableSpacesAtom,
  CurrentSpaceAtom,
  CurrentSpaceDisplayNameAtom,
} from '../stores/namespaces.state'
import { SpaceEditModal } from './space-edit-modal.component'

export interface SpaceSelectModalProps {
  closeModal: () => void
}

export function SpaceSelectModal(props: SpaceSelectModalProps) {
  const availableSpaces = useAtom(AvailableSpacesAtom)[0]
  const currentSpaceDisplayName = useAtom(CurrentSpaceDisplayNameAtom)[0]
  const currentSpace = useAtom(CurrentSpaceAtom)[0]

  const [nsEditOpen, setNsEditOpen] = React.useState(false)

  return (
    <>
      {nsEditOpen && (
        <SpaceEditModal
          closeModal={() => {
            setNsEditOpen(false)
          }}
        />
      )}
      <GenericModal
        okCallback={props.closeModal}
        cancelCallback={props.closeModal}
        size="2xl"
        title="Available Spaces"
        hideOkButton
      >
        <Table>
          <Thead>
            <Tr>
              <Th>Space Name</Th>
              <Th>Visibility</Th>
              <Th>Default Space</Th>
            </Tr>
          </Thead>
          <Tbody>
            {availableSpaces.map((space, ix) => {
              return (
                <Tr key={ix}>
                  <Td>{space.name}</Td>
                  <Td>
                    {space.isPrivate ? (
                      <Flex flexDirection="row">
                        <Text marginRight="5px">Private</Text>
                        <GrSecure />
                      </Flex>
                    ) : (
                      'Public'
                    )}
                  </Td>
                  <Td>{space._id === currentSpace?._id ? 'Yes' : 'No'}</Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
        <Flex flexDirection="row" marginTop="20px">
          <Spacer></Spacer>
          <Button
            leftIcon={<GrAdd size="24px" />}
            marginRight="20px"
            onClick={() => {
              setNsEditOpen(true)
            }}
          >
            New Space
          </Button>
          <Button
            onClick={() => {
              props.closeModal()
            }}
          >
            Ok
          </Button>
        </Flex>
      </GenericModal>
    </>
  )
}
