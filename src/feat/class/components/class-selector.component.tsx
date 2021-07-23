import { Box } from '@chakra-ui/react'
import React from 'react'
import Select from 'react-select'

import { EntityClassResource } from '../models/entity-class.model'
import { EntityClassService } from '../services/entity-class.service'
import { ReactSelectItem } from '../../../common/models/react-select-item.model'
import { SearchService } from '../../search/services/search.service'

export interface ClassSelectorProps {
  cssClassName: string
  setSelectedClassId: (val: string) => void
  setSelectedClassName?: (name: string) => void
  defaultNamespaceId: string
  autofocus: boolean
  getDdRef?: (ref: any) => void
}

export function ClassSelector(props: ClassSelectorProps) {
  const [searchText, setSearchText] = React.useState('')
  const [searchResults, setSearchResults] = React.useState<ReactSelectItem[]>([])
  const [selectedClass, setSelectedClass] = React.useState<ReactSelectItem>({
    value: '',
    label: '',
  })
  const ddRef = React.useRef<any>()

  React.useEffect(() => {
    void updateOptions(searchText)
  }, [searchText])

  React.useEffect(() => {
    if (props.getDdRef) props.getDdRef(ddRef)
    if (props.autofocus && ddRef?.current != null) ddRef.current.focus()
  }, [])

  const updateOptions = React.useCallback(
    async (searchString: string) => {
      // TODO - search entity class repo here and load results into matches before proceeding
      const classes = await SearchService.searchEntityClasses(searchString)

      const matches: ReactSelectItem[] = classes.map((entClass) => {
        return {
          value: entClass._id,
          label: entClass.name,
        }
      })

      // const matches: ReactSelectItem[] = []
      if (matches.length == 0) {
        setSearchResults([
          {
            value: 'createnew',
            label: `Create new class '${searchString}'`,
          },
        ])
      } else {
        setSearchResults(matches)
      }
    },
    [searchText],
  )

  const createwNewClass = React.useCallback(
    async (name: string, namespaceId: string) => {
      const newClass = await EntityClassService.createEntityClass(name, namespaceId)
      props.setSelectedClassId(newClass._id)
      /**
       * search results should be value = class id and label = class name
       */
      setSearchResults([{ value: newClass._id, label: newClass.name }])
      setSelectedClass({ value: newClass._id, label: newClass.name })
      if (props.setSelectedClassName) props.setSelectedClassName(newClass.name)
    },
    [setSelectedClass, props.setSelectedClassId],
  )

  return (
    <Box id="entity-class-selector" className={props.cssClassName}>
      <Select
        options={searchResults}
        isSearchable
        value={selectedClass}
        placeholder="Select a class..."
        emptySearchMessage="Type to search or create new"
        valueKey="_id"
        labelKey="name"
        onInputChange={(text: string) => setSearchText(text)}
        onChange={(newValue) => {
          if (newValue?.value === 'createnew') {
            void createwNewClass(searchText, props.defaultNamespaceId)
            return
          }

          if (props.setSelectedClassName) props.setSelectedClassName(newValue?.label || '')

          if (newValue != null) setSelectedClass(newValue || new EntityClassResource('', ''))
          props.setSelectedClassId(newValue?.value || '')
        }}
      />
    </Box>
  )
}
