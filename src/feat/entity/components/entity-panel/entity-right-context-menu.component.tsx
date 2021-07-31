import { Heading } from '@chakra-ui/react'
import { css } from 'emotion'
import React from 'react'

import { InboundRelationDisplay } from './entity-right-context-menu/InboundRelationDisplay'
import { OutboundRelationDisplay } from './entity-right-context-menu/OutboundRelationDisplay'

export interface EntityRightContextMenuProps {
  entityId: string
  // TODO - figure out modification props from db
  entityModificationProps: any
  setOutboundRelationCreateOpen: (isOpen: boolean) => void
}

export function EntityRightContextItems(props: EntityRightContextMenuProps) {
  return (
    <>
      <Heading
        size="lg"
        margin="none"
        className={css`
          margin-top: 10px;
          margin-bottom: 25px;
          font-style: italic;
        `}
      >
        Item Facts
      </Heading>
      <OutboundRelationDisplay entityId={props.entityId} />
      <InboundRelationDisplay entityId={props.entityId} />
      {/* <Heading
        margin="none"
        level={3}
        className={css`
          margin-top: 15px;
        `}
      >
        Other
      </Heading>
      {props.entityModificationProps.created_at && (
        <Text key="created">Created: {Dates.getRelativeReadableDate(props.entityModificationProps.created_at)} </Text>
      )}
      {props.entityModificationProps.updated_at && (
        <Text key="modified">Modified: {Dates.getRelativeReadableDate(props.entityModificationProps.updated_at)} </Text>
      )} */}
    </>
  )
}
