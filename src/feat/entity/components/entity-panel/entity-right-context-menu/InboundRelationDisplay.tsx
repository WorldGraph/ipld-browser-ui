import { AccordionIcon, Box, Button, Heading } from '@chakra-ui/react'
import { css } from 'emotion'
import { Accordion, AccordionItem, AccordionButton, AccordionPanel } from '@chakra-ui/react'
import * as lodash from 'lodash'
import React from 'react'
import { navigateWithCtrlSensitivity } from '../../../../../common/util/navigate'
import { EntityRelationOneSide } from '../../../../entity_relation/model/entity-relation-one-side.component'
import { EntityRelationService } from '../../../../entity_relation/services/entity-relation.service'
import { useAtom } from 'jotai'
import { entityNameAtom } from '../../../stores/entity.state'

export interface InboundRelationDisplayProps {
  entityId: string
}

export function InboundRelationDisplay(props: InboundRelationDisplayProps) {
  const [inboundRel, setInboundRelations] = React.useState<EntityRelationOneSide[]>([])
  const [activeAccordionIx, setActiveAccordionIx] = React.useState<number[]>([])

  const [entityName] = useAtom(entityNameAtom)

  const hydrateInboundRel = React.useCallback(async (eid: string) => {
    const inboundRel = await EntityRelationService.getInboundRelationsReadable(eid)
    setInboundRelations(inboundRel)
  }, [])

  const erGroups = React.useMemo(() => {
    const groupMap = new Map<string, EntityRelationOneSide[]>()
    const finalGroups: EntityRelationOneSide[][] = []
    inboundRel.forEach((x) => {
      if (!groupMap.has(x.relationName)) groupMap.set(x.relationName, [])
      groupMap.get(x.relationName)?.push(x)
    })
    for (const g of groupMap) {
      g[1].sort((x, y) => (x.relationName > y.relationName ? 1 : -1))
      finalGroups.push(g[1])
    }
    // console.log(`returning finalGroups`, finalGroups);
    return finalGroups
  }, [inboundRel])

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
    void hydrateInboundRel(props.entityId)
  }, [props.entityId])

  return (
    <>
      <Box
        className={css`
          display: flex;
          flex-direction: row;
          margin-bottom: 5px;
          margin-top: 30px;
        `}
      >
        <Heading size="lg" margin="none">
          Inbound Relationships
        </Heading>
      </Box>
      <Box id="inbound-rel-accordion">
        <Accordion allowMultiple>
          {erGroups.map((group, outerIx) => {
            return (
              <AccordionItem key={outerIx}>
                <h3>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      {lodash.capitalize(group[0].relationName) +
                        ` ${entityName.length > 30 ? entityName.slice(0, 27) + '...' : entityName}`}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h3>
                <AccordionPanel>
                  {group.map((er, ix) => {
                    return (
                      <Box
                        key={er.targetId}
                        className={css`
                          display: flex;
                          flex-direction: row;
                        `}
                      >
                        <Button
                          className={css`
                            margin-left: 5px;
                            color: blue;
                            z-index: 10;
                          `}
                          key={er.targetId + 'btn'}
                          onClick={(e) => {
                            e.stopPropagation()
                            navigateWithCtrlSensitivity(`/item/${er.targetId}`, e)
                          }}
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
                label={
                  lodash.capitalize(group[0].relationName) +
                  ` ${entityName.length > 30 ? entityName.slice(0, 27) + '...' : entityName}`
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
                        <Button
                          className={css`
                            margin-left: 5px;
                            color: blue;
                            z-index: 10;
                          `}
                          key={er.targetId + 'btn'}
                          onClick={(e) => {
                            e.stopPropagation()
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
