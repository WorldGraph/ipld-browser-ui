import { BasicProfile } from '@ceramicstudio/idx-constants'
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  Spacer,
  Text,
  useToast,
} from '@chakra-ui/react'
import { FaInfoCircle } from 'react-icons/fa'
import { navigate } from '@reach/router'
import { Field, Form, Formik } from 'formik'
import { useAtom } from 'jotai'
import React, { useCallback, useState } from 'react'
import {
  useIdxEnv,
  useUserLoggedIn,
} from '../../../../../../common/ceramic_utils/client/hooks/idx-env.hooks'
import { getLoggedInDID } from '../../../../../../common/ceramic_utils/client/idx.state'
import { GenericModal } from '../../../../../../common/components'
import { NotImplementedException } from '../../../../../../common/exceptions/not-implemented.exception'
import { UserBasicProfileAtom } from '../../../../../user/stores/user.state'
import { CopyableStringModal } from '../../../../../../common/components/Input/copyable-string-modal.component'

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
  const setFormValue = React.useState<BasicProfile>({})[1]

  const [idxEnv] = useIdxEnv()
  const loggedIn = useUserLoggedIn()

  const tryGetIdxProfile = useCallback(async () => {
    const profile = await idxEnv.self?.getProfile()
    if (profile) {
      setFormValue(profile)
    }
  }, [])

  const [basicProfile, setBasicProfile] = useAtom(UserBasicProfileAtom)
  const [idModalOpen, setIdModalOpen] = useState(false)

  const toast = useToast()

  React.useEffect(() => {
    // Must rehydrate user if it already exists.
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
          props.closeCallback()
          toast({
            title: 'Profile update successful',
            duration: 2000,
            isClosable: true,
          })
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
      size="2xl"
      hideOkButton
    >
      {idModalOpen && (
        <CopyableStringModal
          title="Your user ID"
          copyableText={getLoggedInDID() ?? 'ID NOT FOUND'}
          okCallback={() => {
            setIdModalOpen(false)
          }}
        />
      )}
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
        {({ isSubmitting, isValid, touched }) => (
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
            <Button
              variant="ghost"
              fontWeight="semibold"
              onClick={() => setIdModalOpen(true)}
              paddingLeft="2px"
              paddingRight="2px"
              marginTop="10px"
            >
              Show / Copy User ID
            </Button>
            <Flex direction="row" marginTop="2rem">
              <Spacer />
              <Button marginRight="1rem" onClick={props.closeCallback}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !isValid || !(touched.description || touched.name)}
              >
                Save Changes
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </GenericModal>
  )
}
