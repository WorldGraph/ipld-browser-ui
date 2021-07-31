import { css } from 'emotion'
import {
  Box,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  HStack,
} from '@chakra-ui/react'
import isHotkey from 'is-hotkey'
import React from 'react'

const HotkeyMap = new Map<string, string>()
HotkeyMap.set('mod+enter', 'saveAndQuit')

export interface GenericModalProps {
  id?: string
  title: string
  cancelCallback: () => void
  okCallback: () => void
  height: string
  width: string
  children: React.ReactNode
  showCancelButton?: boolean
  okButtonText?: string
}

export function GenericModal(props: GenericModalProps) {
  const layerOnKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      HotkeyMap.forEach((value, key) => {
        if (isHotkey(key, event as any)) {
          event.preventDefault()
          props.okCallback()
        }
      })
    },
    [props.okCallback],
  )

  return (
    <Modal
      isOpen={true}
      id={props.id}
      onEsc={() => {
        props.cancelCallback()
      }}
      onClose={() => props.cancelCallback()}
    >
      <ModalOverlay>
        <ModalContent w={props.width} h={props.height}>
          <ModalHeader>{props.title}</ModalHeader>
          <ModalBody>
            <Box
              className={css`
                flex: 1 0 50px;
              `}
            >
              {props.children}
            </Box>
            <ModalFooter>
              <HStack>
                {props.showCancelButton && (
                  <Button mr="1rem" onClick={() => props.cancelCallback()}>
                    Cancel
                  </Button>
                )}
                <Button onClick={() => props.okCallback()}>{props.okButtonText || 'Ok'}</Button>
              </HStack>
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}
