import {
  Box,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react'
import React from 'react'

import { IndexedItemFilter } from '../../../search/IxSearchModel/IndexedItemFilter'
import { SearchService } from '../../../search/services/search.service'
import { EntityHeader } from '../../model/entity-header.model'
import { EntityLinkItem } from '../common/entity-link-item.component'

export interface EntitySearchResultDropProps {
  visible: boolean
  onClickOutside: () => void
  searchFilter: IndexedItemFilter
  /**
   * This is the popover anchor element
   */
  children: React.ReactNode
}

export function EntitySearchResultDrop(props: EntitySearchResultDropProps) {
  // if (!props.visible) return <></>

  const [resultEntities, setResultEntities] = React.useState<EntityHeader[]>([])

  const refreshResultEntities = React.useCallback(async (filter: IndexedItemFilter) => {
    const items = await SearchService.searchEntityHeaders(filter.nameSearchTerm || '')

    setResultEntities(items)
  }, [])

  React.useEffect(() => {
    void refreshResultEntities(props.searchFilter)
  }, [props.searchFilter])

  // New chakra component
  return (
    <Popover
      isOpen={props.visible}
      id="search-popover"
      placement="bottom-start"
      // closeOnBlur={true}
      // onClose={props.onClickOutside}
      autoFocus={false}
    >
      <PopoverTrigger>{props.children}</PopoverTrigger>
      <PopoverContent color="white" borderColor="blue.800">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody paddingLeft="0px">
          <Box>
            {resultEntities.map((entity) => {
              return <EntityLinkItem key={entity._id} item={entity} />
            })}
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
