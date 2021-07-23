import { Box, Button, Heading } from '@chakra-ui/react'
import { css } from 'emotion'
import React from 'react'
import { NotificationService } from '../notifications/services/NotificationService'
import { notifSelectors, useNotificationStore } from '../notifications/stores/NotificationStore'
import { ErrorBoundary } from '../telemetry/components/error-boundary.component'
import { userStoreSelectors, useUserStore } from '../user/stores/UserStore'

export interface AdminPanelProps {
  path?: string
}

const rebuildBtn = css`
  margin-top: 15px;
  width: 150px;
`

export function AdminPanel(props: AdminPanelProps) {
  const user = useUserStore(userStoreSelectors.user)

  const notifStore = useNotificationStore(notifSelectors.all)
  const notifService = React.useMemo(() => {
    return new NotificationService(notifStore)
  }, [notifStore])

  const importData = React.useCallback(() => {}, [])

  const exportData = React.useCallback(async () => {}, [])

  return (
    <ErrorBoundary regionName="AdminPanel">
      <Box
        className={css`
          padding: 20px;
        `}
      >
        <Heading>Data import / export</Heading>
        <Box className={rebuildBtn}>
          <Button onClick={() => importData()}>Import Data</Button>
        </Box>
        <Box className={rebuildBtn}>
          <Button onClick={() => exportData()}>Export Data</Button>
        </Box>
      </Box>
    </ErrorBoundary>
  )
}
