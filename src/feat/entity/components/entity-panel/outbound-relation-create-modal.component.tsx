import { css } from 'emotion'
import { Text } from '@chakra-ui/react'
import React from 'react'
import { EntityRelationService } from '../../../entity_relation/services/entity-relation.service'
import { GenericModal } from '../../../../common/components'
import { RelationSelector } from '../../../relation/components/relation-selector.component'
import { EntitySelector } from '../entity-selector.component'
import { GrFormNextLink } from 'react-icons/gr'

export interface OutboundRelationCreateModalProps {
  defaultNamespaceId: string
  sourceEntityName: string
  sourceEntityId: string
  okCallback: () => void
  cancelCallback: () => void
}

const ddClass = css`
  padding-top: 10px;
`

const iconClass = css`
  margin-top: 5px;
  height: 32px;
  width: 32px;
`

export function OutboundRelationCreateModal(props: OutboundRelationCreateModalProps) {
  const [relationId, setRelationId] = React.useState('')
  const [targetEntityId, setTargetEntityId] = React.useState('')
  const targetSelectRef = React.useRef<any>()

  const createEntityRelation = React.useCallback(
    async (sourceId: string, relationId: string, targetId: string) => {
      await EntityRelationService.createEntityRelation(sourceId, targetId, relationId)
      props.okCallback()
    },
    [props.okCallback],
  )

  return (
    <GenericModal
      id="outbound-rel-create-modal"
      title="Create Relationship"
      cancelCallback={props.cancelCallback}
      okCallback={() => {
        void createEntityRelation(props.sourceEntityId, relationId, targetEntityId)
      }}
      size="xl"
      showCancelButton={true}
      okButtonText="Ok"
    >
      <Text fontWeight="500">{props.sourceEntityName}</Text>
      <GrFormNextLink className={iconClass} />
      <RelationSelector
        autofocus
        cssClassName={ddClass}
        setSelectedRelationId={(value: string) => {
          console.log(`setting relation id `, value)
          setRelationId(value)
          if (targetSelectRef.current) targetSelectRef.current.focus()
        }}
        defaultNamespaceId={props.defaultNamespaceId}
        required
      />
      <GrFormNextLink className={iconClass} />
      <EntitySelector
        getDdRef={(ref: any) => (targetSelectRef.current = ref.current)}
        className={ddClass}
        setSelectedEntityId={setTargetEntityId}
        defaultNamespaceId={props.defaultNamespaceId}
        required
      />
    </GenericModal>
  )
}
