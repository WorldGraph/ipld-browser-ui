import { Button } from '@chakra-ui/react'
import React from 'react'

import { navigateWithCtrlSensitivity } from '../../../../common/util/navigate'
import { EntityClassService } from '../../../class/services/entity-class.service'
import { StringIndexable } from '../../../indexes/models/StringIndexable'
import { EntityHeader } from '../../model/entity-header.model'

export interface RecentActivityItemProps {
  item: EntityHeader
}

export function EntityLinkItem(props: RecentActivityItemProps) {
  const [title, setTitle] = React.useState('')
  const getTitle = React.useCallback(async (entity: EntityHeader) => {
    const entityClass = await EntityClassService.getEntityClass(entity.classId)

    let className = ''
    if (entityClass?.name != null && entityClass?.name !== '')
      className = ' (' + entityClass.name + ')'

    if (entity.isDeprecated !== true) {
      setTitle(entity.name + className)
    } else {
      setTitle(entity.name + className + ' (deprecated)')
    }
  }, [])

  React.useEffect(() => {
    void getTitle(props.item)
  }, [props.item._id])

  return (
    <Button
      width="100%"
      textAlign="left"
      variant="ghost"
      style={{ display: 'block', fontSize: '24px' }}
      color="purple"
      onClick={(e) => {
        navigateWithCtrlSensitivity(`/item/${props.item._id}`, e)
      }}
    >
      {title}
    </Button>
  )
}
