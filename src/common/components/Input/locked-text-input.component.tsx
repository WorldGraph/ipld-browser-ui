import { Box, Input } from '@chakra-ui/react'
import React from 'react'

export interface LockedTextInputProps {
  id: string
  value: string
  setValue: (val: string) => void
  editable: boolean
  placeholder: string
  containerClassName: string
  isEditing: boolean
}

export function LockedTextInput(props: LockedTextInputProps) {
  return (
    <Box
      onClick={!props.isEditing ? undefined : () => {}}
      id={props.id}
      hoverindicator={{ color: 'lightgreen' }}
      className={props.containerClassName}
    >
      <Input
        placeholder={props.placeholder}
        value={props.value}
        border={props.isEditing ? '1px solid red' : undefined}
        variant="unstyled"
        paddingLeft="11px"
        fontSize="2rem"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setValue(e?.target?.value)}
        isDisabled={!props.isEditing}
        disabled={!props.isEditing}
      />
      {/* <TextInput
        className={props.textInputClassName}
        id="entity-text-input"
        size="xxlarge"
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setValue(e?.target?.value)}
        plain
        disabled={!props.isEditing}
      /> */}
    </Box>
  )
}
