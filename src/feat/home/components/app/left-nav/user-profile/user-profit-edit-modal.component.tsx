import { BasicProfile } from '@ceramicstudio/idx-constants'
import { Button, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import React, { useCallback } from 'react'
import { useIdxEnv } from '../../../../../../common/ceramic_utils/client/hooks/env'
import { GenericModal } from '../../../../../../common/components'
import { NotImplementedException } from '../../../../../../common/exceptions/not-implemented.exception'
import { UserModel } from '../../../../../user/models/user.model'

export interface UserProfileEditModalProps {
  cancelCallback: () => void
  okCallback: (formValues: UserModel) => void
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

export function UserProfileEditModal(props: UserProfileEditModalProps) {
  //   const [formValue, setFormValue] = React.useState<UserModel>(blankUserModel)
  const [formValue, setFormValue] = React.useState<BasicProfile>({})

  const [idxEnv] = useIdxEnv()

  //   const userProfile = useAtom(userProfileAtom)[0]
  const tryGetIdxProfile = useCallback(async () => {
    console.log(`trying to get idx profile`)
    const profile = await idxEnv.self?.getProfile()
    console.log(`got profile `, profile)
    if (profile) {
      setFormValue(profile)
    }
  }, [])

  // Must rehydrate user if it already exists.
  React.useEffect(() => {
    void tryGetIdxProfile()
  }, [])

  const setProfile = useCallback(
    async (profile: BasicProfile) => {
      console.log(`will try to set basic profile`, profile)
      if (!idxEnv.self) {
        throw new Error(`User not logged in! cannot set profile`)
      } else {
        await idxEnv.self?.setProfile(profile)
      }
    },
    [idxEnv.self],
  )

  return (
    <GenericModal
      title="Edit Profile"
      cancelCallback={props.cancelCallback}
      okCallback={() => {
        throw new NotImplementedException('Method')
        // props.okCallback(formValue)
      }}
      height="40rem"
      width="40rem"
      showCancelButton
    >
      {/* Formik docs: https://formik.org/docs/overview 
	Usage with chakra ui https://chakra-ui.com/docs/form/form-control
      */}
      <Formik
        initialValues={{ name: '', description: '' }}
        onSubmit={(values, actions) => {
          //   console.log(`got values`, values)
          void setProfile(values)
          // TODO - figure out timeout w.r.t. submission time
          setTimeout(() => {
            actions.setSubmitting(false)
          }, 10000)
        }}
      >
        {({ isSubmitting, isValid }) => (
          <Form>
            <Field name="name" validate={FormValidator.validateName}>
              {({ field, form }: any) => (
                <FormControl isInvalid={form.errors.name && form.touched.name}>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <Input {...field} id="name" placeholder="name" />
                  <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="description">
              {({ field, form }: any) => (
                <FormControl isInvalid={form.errors.description && form.touched.description}>
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <Input {...field} id="description" placeholder="description" />
                </FormControl>
              )}
            </Field>
            <Button
              marginTop="10px"
              display="block"
              type="submit"
              disabled={isSubmitting || !isValid}
            >
              Submit
            </Button>
          </Form>
        )}

        {/* <Form>
          <Field name="userName">
            <FormLabel>User Name</FormLabel>
            <Input placeholder="User Name" />
          </Field>
          <Field name="email">
            <FormLabel>Email</FormLabel>
            <Input placeholder="me@me.com" />
          </Field>
          <Field name="firstName">
            <FormLabel>First Name</FormLabel>
            <Input placeholder="" />
          </Field>
          <Field name="lastName">
            <FormLabel>Last Name</FormLabel>
            <Input placeholder="" />
          </Field>
          <Button type="submit">Submit</Button>
        </Form> */}
      </Formik>
    </GenericModal>
  )
}
