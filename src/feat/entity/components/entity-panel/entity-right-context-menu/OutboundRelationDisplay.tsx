import { AccordionIcon, Box, Button, Heading } from '@chakra-ui/react'
import { css } from 'emotion'
import * as lodash from 'lodash'
import { Accordion, AccordionItem, AccordionButton, AccordionPanel } from '@chakra-ui/react'
import React from 'react'

import { OutboundRelationCreateModal } from '../outbound-relation-create-modal.component'
import {
  userStoreMutators,
  userStoreSelectors,
  useUserStore,
} from '../../../../user/stores/UserStore'
import { EntityRelationOneSide } from '../../../../entity_relation/model/entity-relation-one-side.component'
import {
  entityStoreMutators,
  entityStoreSelectors,
  useEntityStore,
} from '../../../stores/entity.store'
import { EntityRelationService } from '../../../../entity_relation/services/entity-relation.service'
import { ConfirmModal } from '../../../../../common/components'
import { navigateWithCtrlSensitivity } from '../../../../../common/util/navigate'
import { GrAddCircle, GrEdit, GrTrash } from 'react-icons/gr'

export interface OutboundRelationDisplayProps {
  entityId: string
}

export function OutboundRelationDisplay(props: OutboundRelationDisplayProps) {
  const [editingRelations, setEditingRelations] = React.useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = React.useState(false)
  const [confirmModalAction, setConfirmModalAction] = React.useState<() => void>(() => () => {
    console.log(`initial action assignment`)
  })
  const [confirmModalDescription, setConfirmModalDescription] = React.useState('')
  const [outboundRelations, setOutboundRelations] = React.useState<EntityRelationOneSide[]>([])
  const [activeAccordionIx, setActiveAccordionIx] = React.useState<number[]>([])
  const [outboundRelationCreateOpen, setOutboundRelationCreateOpen] = React.useState(false)
  const user = useUserStore(userStoreSelectors.user)
  const setUser = useUserStore(userStoreMutators.setUser)
  const entityName = useEntityStore(entityStoreSelectors.entityName)
  const setEntityName = useEntityStore(entityStoreMutators.setName)

  const hydrateOutboundRel = React.useCallback(async (entityId: string) => {
    // const outboundRel = await serverApi.getOutboundForEntity(entityId)
    const outboundRel = await EntityRelationService.getOutboundRelationsReadable(entityId)
    setOutboundRelations(outboundRel)
  }, [])

  const erGroups = React.useMemo(() => {
    const groupMap = new Map<string, EntityRelationOneSide[]>()
    const finalGroups: EntityRelationOneSide[][] = []
    outboundRelations.forEach((x) => {
      if (!groupMap.has(x.relationName)) groupMap.set(x.relationName, [])
      groupMap.get(x.relationName)?.push(x)
    })
    for (const g of groupMap) {
      g[1].sort((x, y) => (x.relationName > y.relationName ? 1 : -1))
      finalGroups.push(g[1])
    }
    // console.log(`returning finalGroups`, finalGroups);
    return finalGroups
  }, [outboundRelations])

  const groupDefaultArray = React.useMemo(() => {
    const arr: number[] = []
    for (let i = 0; i < erGroups.length; i++) {
      arr.push(i)
    }
    return arr
  }, [erGroups])

  React.useEffect(() => {
    const aix: number[] = []
    erGroups.forEach((x, ix) => {
      aix.push(ix)
    })
    setActiveAccordionIx(aix)
  }, [erGroups])

  React.useEffect(() => {
    if (props.entityId == null || props.entityId === '') {
      return
    }
    void hydrateOutboundRel(props.entityId)
  }, [props.entityId])

  return (
    <>
      {outboundRelationCreateOpen && (
        <OutboundRelationCreateModal
          defaultNamespaceId={user.defaultNamespaceId}
          sourceEntityName={entityName}
          sourceEntityId={props.entityId || ''}
          okCallback={() => {
            void hydrateOutboundRel(props.entityId)
            setOutboundRelationCreateOpen(false)
          }}
          cancelCallback={() => {
            setOutboundRelationCreateOpen(false)
          }}
        />
      )}
      {confirmModalOpen && (
        <ConfirmModal
          heading="Confirm Deletion?"
          description={confirmModalDescription}
          okCallback={confirmModalAction}
          cancelCallback={() => {
            setConfirmModalAction(() => {})
            setConfirmModalDescription('')
            setConfirmModalOpen(false)
          }}
        />
      )}
      <Box
        className={css`
          display: flex;
          flex-direction: row;
          margin-bottom: 5px;
        `}
      >
        <Heading size="lg" margin="none">
          Relationships
        </Heading>
        <Button
          title="Edit Relationship"
          className={css`
            margin-left: 15px;
            z-index: 10;
          `}
          leftIcon={<GrEdit size="17px" />}
          onClick={() => setEditingRelations(!editingRelations)}
        >
          Edit Relationship
        </Button>
        <Button
          title="Add New Relationship"
          className={css`
            margin-left: 15px;
            z-index: 10;
          `}
          leftIcon={<GrAddCircle size="17px" />}
          onClick={() => setOutboundRelationCreateOpen(true)}
        >
          Add New Relationship
        </Button>
      </Box>
      <Box id="outbound-rel-accordion">
        <Accordion allowMultiple index={groupDefaultArray}>
          {erGroups.map((group, outerIx) => {
            return (
              <AccordionItem key={outerIx} paddingLeft="0">
                <AccordionButton fontSize="1.2rem" paddingLeft="0">
                  <Box flex="1" textAlign="left">
                    {` ${entityName.length > 30 ? entityName.slice(0, 27) + '...' : entityName}` +
                      ' ' +
                      lodash.capitalize(group[0].relationName)}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel paddingLeft="0" paddingBottom="0" paddingTop="0">
                  {group.map((er, ix) => {
                    return (
                      <Box key={er.targetId}>
                        <Button
                          color="blue"
                          key={er.targetId + 'btn'}
                          onClick={(e) => {
                            e.stopPropagation()
                            navigateWithCtrlSensitivity(`/item/${er.targetId}`, e)
                          }}
                          variant="unstyled"
                        >
                          {er.targetName}
                        </Button>
                      </Box>
                    )
                  })}
                </AccordionPanel>
              </AccordionItem>
            )
          })}
        </Accordion>
        {/* <Accordion multiple activeIndex={activeAccordionIx}>
          {erGroups.map((group, outerIx) => {
            const bgColorClass =
              outerIx % 2 === 0
                ? css`
                    background: #f5f5f5;
                  `
                : ''
            return (
              <AccordionPanel
                key={outerIx}
                id={`panel-id-${outerIx}`}
                // label={`${entityName} ` + lodash.capitalize(group[0].relationName)}
                label={
                  ` ${entityName.length > 30 ? entityName.slice(0, 27) + '...' : entityName}` +
                  ' ' +
                  lodash.capitalize(group[0].relationName)
                }
                className={css`
                  height: 25px;
                  white-space: nowrap;
                  ${bgColorClass}
                `}
                onClick={() => {
                  if (activeAccordionIx.includes(outerIx)) {
                    setActiveAccordionIx(activeAccordionIx.filter((x) => x !== outerIx))
                  } else {
                    setActiveAccordionIx([...activeAccordionIx, outerIx])
                  }
                }}
              >
                <Box className={bgColorClass}>
                  {group.map((er, ix) => {
                    return (
                      <Box
                        key={er.targetId}
                        className={css`
                          display: flex;
                          flex-direction: row;
                        `}
                      >
                        {editingRelations && (
                          <Button
                            key={er.targetId}
                            className={css`
                              margin-right: 10px;
                              z-index: 10;
                            `}
                            leftIcon={<GrTrash size="17px" />}
                            onClick={(e) => {
                              e.stopPropagation()
                              setConfirmModalAction(() => () => {
                                void EntityRelationService.deleteEntityRelation(er.entRelId)
                                setOutboundRelations(
                                  outboundRelations.filter((x) => x.entRelId !== er.entRelId),
                                )
                                setConfirmModalOpen(false)
                                setConfirmModalDescription('')
                                setConfirmModalAction(() => () => {})
                              })
                              setConfirmModalDescription(
                                `Delete relation ${er.relationName} ${er.targetName}?`,
                              )
                              setConfirmModalOpen(true)
                            }}
                          />
                        )}
                        <Button
                          className={css`
                            margin-left: 5px;
                            color: blue;
                            z-index: 10;
                          `}
                          key={er.targetId + 'btn'}
                          onClick={(e) => {
                            e.stopPropagation()
                            console.log(`navigating to target `, er.targetId)
                            navigateWithCtrlSensitivity(`/item/${er.targetId}`, e)
                          }}
                        >
                          {er.targetName}
                        </Button>
                      </Box>
                    )
                  })}
                </Box>
              </AccordionPanel>
            )
          })}
        </Accordion> */}
      </Box>
    </>
  )
}
