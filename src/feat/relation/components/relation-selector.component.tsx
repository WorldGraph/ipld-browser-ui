import { Box, Text } from '@chakra-ui/react'
import { match } from 'assert'
import React from 'react'
import Select from 'react-select'

import { ReactSelectItem } from '../../../common/models/react-select-item.model'
import { SearchService } from '../../search/services/search.service'
import { RelationService } from '../services/relation.service'

export interface RelationSelectorProps {
  cssClassName: string
  setSelectedRelationId: (val: string) => void
  defaultNamespaceId: string
  autofocus: boolean
  getDdRef?: (ref: any) => void
  required?: boolean
}

export function RelationSelector(props: RelationSelectorProps) {
  const [searchText, setSearchText] = React.useState('')
  const [searchResults, setSearchResults] = React.useState<ReactSelectItem[]>([])
  const [selected, setSelected] = React.useState<ReactSelectItem | null>(null)
  const ddRef = React.useRef<any>()

  React.useEffect(() => {
    void updateOptions(searchText)
  }, [searchText])

  React.useEffect(() => {
    if (props.getDdRef) props.getDdRef(ddRef)
    if (props.autofocus && ddRef?.current != null) ddRef.current.focus()
  }, [])

  const updateOptions = React.useCallback(async (searchString: string) => {
    // TODO - search entity class repo here and load results into matches before proceeding
    const relations = await SearchService.searchRelations(searchString)

    const matches: ReactSelectItem[] = relations.map((relation) => {
      return {
        value: relation._id,
        label: relation.name,
      }
    })

    if (matches.length == 0) {
      setSearchResults([
        {
          value: 'createnew',
          label: `Create new relation '${searchString}'`,
        },
      ])
    } else {
      setSearchResults(matches)
    }
  }, [])

  const createNewRelation = React.useCallback(
    async (name: string, namespaceId: string) => {
      const newClass = await RelationService.createRelation(name, namespaceId)
      console.log(`setting selected relation id `, newClass._id)
      props.setSelectedRelationId(newClass._id)
      /**
       * search results should be value = class id and label = class name
       */
      setSearchResults([{ value: newClass._id, label: newClass.name }])
      setSelected({ value: newClass._id, label: newClass.name })
    },
    [setSelected, props.setSelectedRelationId],
  )

  return (
    <Box id="relation-selector" className={props.cssClassName}>
      <Select
        isSearchable
        ref={ddRef as any}
        options={searchResults}
        value={selected || { value: '', label: 'Select a relation...' }}
        placeholder="Select a relation..."
        emptySearchMessage="Type to search or create new"
        valueKey="Id"
        labelKey="Value"
        onInputChange={(text: string) => {
          setSearchText(text)
        }}
        onChange={(selected) => {
          console.log(`newvalue (should be id) is`, selected)
          if (selected == null) return
          if (selected.value === 'createnew') {
            console.log(`default namespace id is: `, props.defaultNamespaceId)
            void createNewRelation(searchText, props.defaultNamespaceId)
            return
          }

          setSelected(selected)
          props.setSelectedRelationId(selected.value)
        }}
      />
      {props.required && (selected == null || selected.value === '') && (
        <Text color="status-error">Required</Text>
      )}
    </Box>
  )
}
