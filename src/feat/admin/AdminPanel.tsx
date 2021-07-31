import { Box, Button, FormControl, FormErrorMessage, Heading, Icon, Flex } from '@chakra-ui/react'
import { css } from 'emotion'
import React from 'react'
import { FileUpload } from '../../common/components/Input/file-upload.component'
import { ImportExportService } from '../import_export/services/import-export.service'
import { NotificationService } from '../notifications/services/NotificationService'
import { notifSelectors, useNotificationStore } from '../notifications/stores/NotificationStore'
import { ErrorBoundary } from '../telemetry/components/error-boundary.component'
import { userStoreSelectors, useUserStore } from '../user/stores/UserStore'
import { FiFile, FiUpload } from 'react-icons/fi'
import { useForm } from 'react-hook-form'

export interface AdminPanelProps {
  path?: string
}

const rebuildBtn = css`
  margin-top: 15px;
  width: 150px;
`
type FormValues = {
  file_: FileList
}

/**
 * used form example from https://gist.github.com/Sqvall/23043a12a7fabf0f055198cb6ec39531
 */
export function AdminPanel(props: AdminPanelProps) {
  const defaultFilename = '[No file selected]'
  const [fileName, setFileName] = React.useState(defaultFilename)

  const user = useUserStore(userStoreSelectors.user)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormValues>()

  //   const thingy = useForm<FormValues>()
  //   thingy.

  const validateFiles = (value: FileList) => {
    if (value.length !== 1) {
      return `Exactly one file must be selected. Selected length ${value.length}`
    }
    for (const file of Array.from(value)) {
      setFileName(file.name)
      const fsMb = file.size / (1024 * 1024)
      const MAX_FILE_SIZE = 10
      if (fsMb > MAX_FILE_SIZE) {
        return 'Max file size 10mb'
      }
    }
    return true
  }

  const notifStore = useNotificationStore(notifSelectors.all)
  const notifService = React.useMemo(() => {
    return new NotificationService(notifStore)
  }, [notifStore])

  const importData = handleSubmit(async (data) => {
    console.log('On Submit: ', data)
    const files = data.file_
    for (const file of files) {
      const text = await file.text()
      await ImportExportService.ImportData(text)
    }
  })

  const exportData = React.useCallback(async () => {
    await ImportExportService.exportData()
  }, [])

  return (
    <ErrorBoundary regionName="AdminPanel">
      <Box
        className={css`
          padding: 20px;
        `}
      >
        <Heading size="lg" paddingBottom="2rem">
          Data import / export
        </Heading>
        <Heading size="md" paddingBottom="0.5rem">
          Import
        </Heading>
        <Box className={rebuildBtn}>
          <form onSubmit={importData}>
            <Flex>
              <Box paddingRight="2rem">
                <FormControl isInvalid={!!errors.file_} isRequired>
                  <FileUpload
                    accept={'.json'}
                    multiple
                    register={register('file_', { validate: validateFiles })}
                    onChange={(selected: any) => {
                      const filename = selected.target.files[0].name
                      setFileName(filename)
                      //   console.log(`selected is ${selected.target.files[0].name}`)
                      //   for (const prop in selected.target) {
                      //     console.log(`prop is ${prop}`)
                      //   }
                    }}
                  >
                    <Button leftIcon={<Icon as={FiFile} />}>Select File to Import</Button>
                  </FileUpload>

                  <FormErrorMessage>{errors.file_ && errors?.file_.message}</FormErrorMessage>
                </FormControl>
              </Box>
              <Box>
                <Button
                  disabled={fileName === defaultFilename}
                  padding="20px"
                  type="submit"
                  leftIcon={<Icon as={FiUpload} />}
                >
                  {`Upload ${fileName}`}
                </Button>
              </Box>
            </Flex>
            {/* <button>Submit</button> */}
          </form>
        </Box>

        <Heading size="md" paddingBottom="0.5rem" paddingTop="2rem">
          Export
        </Heading>
        <Box className={rebuildBtn}>
          <Button onClick={() => exportData()}>Export Data</Button>
        </Box>
      </Box>
    </ErrorBoundary>
  )
}
