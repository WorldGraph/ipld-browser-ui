import React from 'react'
import { Button, Text } from '@chakra-ui/react'
import { StringIndexable } from '../../indexes/models/StringIndexable'
import { searchEntityNameWithCallback } from '../dal/entityDal'
import { navigateWithCtrlSensitivity } from '../../../common/util/navigate'

export interface EntityCompactSearchResultsProps {
  searchString: string
}

export function EntityCompactSearchResults(props: EntityCompactSearchResultsProps) {
  const [entitySearchResults, setEntitySearchResults] = React.useState<StringIndexable[]>([])
  React.useEffect(() => {
    if (props.searchString == null || props.searchString.length === 0) {
      setEntitySearchResults([])
      return
    }
    void searchEntityNameWithCallback(props.searchString, (res: StringIndexable[]) => {
      setEntitySearchResults(res || [])
    })
  }, [props.searchString])

  return (
    <div>
      {entitySearchResults.map((item) => (
        <Button
          w="200px"
          color="purple"
          onClick={(e) => {
            navigateWithCtrlSensitivity(`/item/${item.id}`, e)
          }}
        >
          {item.value}
        </Button>
      ))}
      {entitySearchResults.length === 0 && <Text>No Results</Text>}
    </div>
  )
}
