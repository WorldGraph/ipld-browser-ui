import { Box, Text } from '@chakra-ui/react'
import React from 'react'
import Select from 'react-select'

import { ReactSelectItem } from '../../../common/models/react-select-item.model'
import { SearchService } from '../../search/services/search.service'
import { EntityHeaderService } from '../services/entity-header.service'

export interface EntitySelectorProps {
  className: string
  defaultNamespaceId: string
  setSelectedEntityId: (entityId: string) => void
  getDdRef?: (ref: any) => void
  autofocus?: boolean
  required?: boolean
}

export function EntitySelector(props: EntitySelectorProps) {
  const [searchText, setSearchText] = React.useState('')
  const [searchResults, setSearchResults] = React.useState<ReactSelectItem[]>([
    {
      value: 'createnew',
      label: '[Create New]',
    },
  ])
  const [selectedEntity, setSelectedEntity] = React.useState<ReactSelectItem | null>(null)
  const ddRef = React.useRef<any>()

  React.useEffect(() => {
    if (props.getDdRef) props.getDdRef(ddRef)
    void updateOptions(searchText)
    if (props.autofocus && ddRef?.current != null) ddRef.current.focus()
  }, [searchText])

  const updateOptions = React.useCallback(async (searchString: string) => {
    // TODO - search entity class repo here and load results into matches before proceeding
    const entities = await SearchService.searchEntityHeaders(searchString)

    const matches: ReactSelectItem[] = entities.map((entity) => {
      return {
        value: entity._id,
        label: entity.name,
      }
    })

    // const matches: ReactSelectItem[] = []
    if (matches.length == 0) {
      setSearchResults([
        {
          value: 'createnew',
          label: `Create new entity '${searchString}'`,
        },
      ])
    } else {
      setSearchResults(matches)
    }
  }, [])

  const createNewEntity = React.useCallback(
    async (name: string, namespaceId: string) => {
      const newClass = await EntityHeaderService.createEntity(name, namespaceId)
      props.setSelectedEntityId(newClass._id)
      /**
       * search results should be value = class id and label = class name
       */
      setSearchResults([{ value: newClass._id, label: newClass.name }])
      setSelectedEntity({ value: newClass._id, label: newClass.name })
      if (props.setSelectedEntityId) props.setSelectedEntityId(newClass._id)
    },
    [setSelectedEntity, props.setSelectedEntityId],
  )

  return (
    <Box id="entity-class-selector" className={props.className}>
      <Select
        isSearchable
        options={searchResults}
        ref={ddRef as any}
        value={selectedEntity || { value: '', label: 'Select an Entity...' }}
        placeholder="Select an Entity..."
        emptySearchMessage="Type to search or create new"
        valueKey="Id"
        labelKey="Value"
        onInputChange={(text: string) => setSearchText(text)}
        onChange={(newValue) => {
          if (!newValue) return
          if (newValue.value === 'createnew') {
            void createNewEntity(searchText, props.defaultNamespaceId)
            return
          }

          setSelectedEntity(newValue)
          props.setSelectedEntityId(newValue.value)
        }}
      />
      {props.required && (selectedEntity == null || selectedEntity.value === '') && (
        <Text color="status-error">Required</Text>
      )}
    </Box>
  )
}
