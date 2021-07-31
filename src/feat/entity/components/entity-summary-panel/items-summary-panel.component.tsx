import { Box, Heading, List, ListItem } from '@chakra-ui/react'
import React from 'react'
import { EntityHeaderService } from '../../services/entity-header.service'
import { widget33 } from '../styles'

export function ItemsSummaryPanel() {
  const [collCount, setCollCount] = React.useState(0)
  const getSummaryInfo = React.useCallback(async () => {
    const count = await EntityHeaderService.getEntityHeaderCount()
    setCollCount(count)
  }, [])
  React.useEffect(() => {
    void getSummaryInfo()
  }, [])

  return (
    <Box className={widget33} bgColor="gray.50">
      <Heading size="lg">Items Summary</Heading>
      <List>
        <ListItem>Collection Count: {collCount}</ListItem>
      </List>
    </Box>
  )
}
