import { Box, Heading } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { UserActivityModel } from '../../../activity/models/user-activity.model'
import { EntityActivityService } from '../../../activity/services/EntityActivityService'
import { IndexService } from '../../../indexes/services/IndexService'
import { userStoreSelectors, useUserStore } from '../../../user/stores/UserStore'
import { EntityHeaderService } from '../../services/entity-header.service'
import { widget33 } from '../styles'
import { RecentActivityItem } from './recent-activity-item.component'

export function RecentActivityPanel() {
  const [recentActivity, setRecentActivity] = React.useState<UserActivityModel[]>([])
  const user = useUserStore(userStoreSelectors.user)

  const getActivities = React.useCallback(async () => {
    const allItems = await EntityHeaderService.getAllEntityHeaders()
    await IndexService.UpsertEntNameIndexEntries(allItems)
    const activities = EntityActivityService.getEntityActivities(allItems)

    setRecentActivity(activities)
  }, [])

  useEffect(() => {
    if (user._id != '') {
      void getActivities()
    }
  }, [user._id])

  return (
    <Box className={widget33} bgColor="gray.50">
      <Heading size="lg">Recent Activity</Heading>
      {recentActivity.map((activity, ix) => {
        return <RecentActivityItem key={activity._id || ix} item={activity} />
      })}
    </Box>
  )
}
