import { Box } from '@chakra-ui/layout'
import React from 'react'
import { GenericModal } from '../../../common/components'
import { blankNamespace, Namespace } from '../model/namespace.model'

export interface NamespaceEditModalProps {
  cancelCallback: () => void
  okCallback: (formValues: Namespace) => void
}

export function SpaceEditModal(props: NamespaceEditModalProps) {
  const [formValue, setFormValue] = React.useState<Namespace>(blankNamespace)

  return (
    <GenericModal
      title="Create Namespace"
      cancelCallback={props.cancelCallback}
      okCallback={() => {
        props.okCallback(formValue)
      }}
      size="3xl"
      showCancelButton
    >
      <Box>Build out this modal</Box>
      {/* <Form
        value={formValue}
        onChange={(nextValue: any) => {
          setFormValue(nextValue)
        }}
        onReset={() => setFormValue(blankNamespace)}
        onSubmit={() => {}}
      >
        <FormField label="Space Name" required>
          <TextInput name="name" />
        </FormField>
      </Form> */}
    </GenericModal>
  )
}
