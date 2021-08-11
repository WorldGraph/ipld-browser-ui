import React, { useEffect, useRef } from 'react'
import { GenericModal } from './generic-modal.component'
import { Flex, IconButton, Input, useToast } from '@chakra-ui/react'
import { MdContentCopy } from 'react-icons/md'

export interface CopyableStringModalProps {
  title: string
  copyableText: string
  okCallback: () => void
}

export function CopyableStringModal(props: CopyableStringModalProps) {
  const inputRef = useRef<HTMLInputElement>()
  const toast = useToast()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <GenericModal
      title={props.title}
      cancelCallback={() => {}}
      okCallback={props.okCallback}
      size="3xl"
    >
      <Flex direction="row">
        <Input
          ref={inputRef as any}
          value={props.copyableText}
          onClick={() => {
            document.execCommand('copy')
            toast({
              title: 'User ID copied to clipboard',
              duration: 3000,
            })
            props.okCallback()
          }}
          onFocus={() => {
            inputRef.current?.select()
          }}
        />
        <IconButton
          marginLeft="10px"
          aria-label="copy text"
          title="copy text"
          icon={<MdContentCopy />}
          onClick={() => {
            document.execCommand('copy')
            toast({
              title: 'User ID copied to clipboard',
              duration: 3000,
            })
            props.okCallback()
          }}
        />
      </Flex>
    </GenericModal>
  )
}
