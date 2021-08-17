import { Box } from '@chakra-ui/layout'
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spacer,
  Switch,
  useToast,
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import React, { useCallback } from 'react'
import { GenericModal } from '../../../common/components'

export interface NamespaceEditModalProps {
  closeModal: () => void
}
class FormValidator {
  static validateName = (name: string) => {
    if (name.length < 3) {
      return 'Name must be at least 3 characters long'
    } else if (name.length > 35) {
      return 'Name must not be greater than 35 characters'
    } else {
      return undefined
    }
  }
}
export function SpaceEditModal(props: NamespaceEditModalProps) {
  const toast = useToast()

  const submitForm = useCallback(
    async (values: { name: string; isPrivate: boolean; makeDefault: boolean }) => {
      console.log(`saving namespace with `, values)
      toast({
        title: 'Created namespace successfully',
        duration: 2000,
        isClosable: true,
      })
    },
    [],
  )

  return (
    <GenericModal
      title="Create Namespace"
      cancelCallback={props.closeModal}
      okCallback={() => {
        props.closeModal()
      }}
      size="3xl"
      hideOkButton
    >
      <Formik
        initialValues={{
          name: '',
          isPrivate: true,
          makeDefault: false,
        }}
        onSubmit={(values) => {
          void submitForm(values)
        }}
      >
        {({ isSubmitting, isValid, touched }) => (
          <Form>
            <Field name="name" validate={FormValidator.validateName}>
              {({ field, form }: any) => (
                <FormControl isInvalid={form.errors.name && form.touched.name}>
                  <FormLabel htmlFor="name">New namespace name</FormLabel>
                  <Input {...field} id="name" placeholder="name" />
                  <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="isPrivate" type="checkbox">
              {({ field, form }: any) => (
                <FormControl
                  marginTop="1rem"
                  isInvalid={form.errors.isPrivate && form.touched.isPrivate}
                >
                  <Flex flexDir="row">
                    <FormLabel htmlFor="isPrivate">Make Private</FormLabel>
                    <Switch
                      {...field}
                      defaultChecked={field.isChecked == null ? true : field.isChecked}
                    />
                  </Flex>
                </FormControl>
              )}
            </Field>

            <Field name="makeDefault">
              {({ field, form }: any) => (
                <FormControl
                  marginTop="1rem"
                  isInvalid={form.errors.makeDefault && form.touched.makeDefault}
                >
                  <Flex flexDir="row">
                    <FormLabel htmlFor="makeDefault">Make Default</FormLabel>
                    <Switch
                      {...field}
                      defaultChecked={field.isChecked == null ? false : field.isChecked}
                    />
                  </Flex>
                </FormControl>
              )}
            </Field>

            <Flex direction="row" marginTop="2rem">
              <Spacer />
              <Button marginRight="1rem" onClick={props.closeModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !isValid || !touched.name}>
                Save Changes
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
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
