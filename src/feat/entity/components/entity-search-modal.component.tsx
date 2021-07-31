import { Button, Input } from '@chakra-ui/react'
import React from 'react'

import { GenericModal } from '../../../common/components'
import { navigateWithCtrlSensitivity } from '../../../common/util/navigate'
import { SearchService } from '../../search/services/search.service'
import { EntityHeader } from '../model/entity-header.model'

export interface EntitySearchModalProps {
  onClose: () => void
}

export function EntitySearchModal(props: EntitySearchModalProps) {
  const [searchText, setSearchText] = React.useState('')
  //   const [indexedItems, setEntities] = React.useState<StringIndexable[]>([])
  const [entities, setEntities] = React.useState<EntityHeader[]>([])

  // ixsearch example

  const updateEntHeaders = React.useCallback(async () => {
    if (searchText == '') {
      setEntities([])
      return
    }

    const items = await SearchService.searchEntityHeaders(searchText || '')
    setEntities(items)
  }, [])

  React.useEffect(() => {
    void updateEntHeaders()
  }, [searchText])

  return (
    <GenericModal
      showCancelButton={false}
      okButtonText="Done"
      cancelCallback={() => props.onClose()}
      okCallback={() => props.onClose()}
      title="Search Items"
      height="400px"
      width="300px"
    >
      <Input autoFocus onChange={(event) => setSearchText(event.target.value)} />
      {entities.map((entity) => {
        return (
          <Button
            key={entity._id}
            onClick={(e) => {
              navigateWithCtrlSensitivity(`/item/${entity._id}`, e)
              props.onClose()
            }}
          >
            {entity.name}
          </Button>
        )
      })}
    </GenericModal>
  )
}
