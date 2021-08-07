import { BasicProfile } from '@ceramicstudio/idx-constants'
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spacer,
} from '@chakra-ui/react'
import { navigate } from '@reach/router'
import { Field, Form, Formik } from 'formik'
import { useAtom } from 'jotai'
import React, { useCallback } from 'react'
import {
  useIdxEnv,
  useUserLoggedIn,
} from '../../../../../../common/ceramic_utils/client/hooks/idx-env.hooks'
import { GenericModal } from '../../../../../../common/components'
import { NotImplementedException } from '../../../../../../common/exceptions/not-implemented.exception'
import { UserBasicProfileAtom } from '../../../../../user/stores/user.state'

export interface UserProfileEditModalProps {
  closeCallback: () => void
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
  const loggedIn = useUserLoggedIn()

  //   const userProfile = useAtom(userProfileAtom)[0]
  const tryGetIdxProfile = useCallback(async () => {
    const profile = await idxEnv.self?.getProfile()
    if (profile) {
      setFormValue(profile)
    }
  }, [])

  const [basicProfile, setBasicProfile] = useAtom(UserBasicProfileAtom)

  // Must rehydrate user if it already exists.
  React.useEffect(() => {
    void tryGetIdxProfile()
  }, [])

  const setProfile = useCallback(
    async (profile: BasicProfile) => {
      if (!loggedIn) {
        void navigate('/login')
      } else {
        try {
          console.log(`trying to set profile`)
          await idxEnv.self?.setProfile(profile)
          setBasicProfile(profile)
          console.log(`closing modal!`)
          props.closeCallback()
        } catch (error) {
          console.error(`Error setting user profile!`, error)
        }
      }
    },
    [idxEnv.self],
  )

  return (
    <GenericModal
      title="Edit Profile"
      cancelCallback={props.closeCallback}
      okCallback={() => {
        throw new NotImplementedException('Method')
        // props.okCallback(formValue)
      }}
      height="40rem"
      width="40rem"
      hideOkButton
    >
      {/* Formik docs: https://formik.org/docs/overview 
	Usage with chakra ui https://chakra-ui.com/docs/form/form-control
      */}
      <Formik
        initialValues={{
          name: basicProfile.name ?? '',
          description: basicProfile.description ?? '',
        }}
        onSubmit={(values, actions) => {
          void setProfile(values)
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
                <FormControl
                  marginTop="1rem"
                  isInvalid={form.errors.description && form.touched.description}
                >
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <Input {...field} id="description" placeholder="description" />
                </FormControl>
              )}
            </Field>
            <Flex direction="row" marginTop="2rem">
              <Spacer />
              <Button marginRight="1rem" onClick={props.closeCallback}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !isValid}>
                Submit
              </Button>
            </Flex>
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
