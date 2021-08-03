import { Box } from '@chakra-ui/react'
import * as Reach from '@reach/router'
import { css } from 'emotion'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { Element as SlateNode } from 'slate'

import { notifMutators, useNotificationStore } from '../../notifications/stores/notification.store'
import { UserFavorite } from '../../preferences/models/user-favorite.model'
import { ErrorBoundary } from '../../telemetry/components/error-boundary.component'
import { userProfileAtom } from '../../user/stores/user-jotai.state'
import { EntityHeader } from '../model/entity-header.model'
import { EntityDocService } from '../services/entity-doc.service'
import { EntityHeaderService } from '../services/entity-header.service'
import {
  entityClassAtom,
  entityIdAtom,
  entityIsDeprecatedAtom,
  entityNameAtom,
  entityNamespaceIdAtom,
} from '../stores/entity-jotai.state'
import { entityMemoryState } from '../stores/entity-memory-state.model'
import { EntityHeaderComponent } from './entity-panel/entity-header.component'
import * as serverActions from './entity-panel/entity-panel-actions.functions'
import { EntityRightContextItems } from './entity-panel/entity-right-context-menu.component'
import { EntitySlateEditor } from './entity-panel/entity-slate-editor.component'
import { OutboundRelationCreateModal } from './entity-panel/outbound-relation-create-modal.component'

export const initialEditorValue: SlateNode[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]

export function EntityPanel(props: {
  path?: string
  style?: React.CSSProperties
  entityId?: string
}) {
  const [entityId, setEntityId] = useAtom(entityIdAtom)
  const [entityName, setEntityName] = useAtom(entityNameAtom)
  const setEntityDeprecated = useAtom(entityIsDeprecatedAtom)[1]
  const [entityNamespaceId, setEntityNamespaceId] = useAtom(entityNamespaceIdAtom)
  const user = useAtom(userProfileAtom)[0]

  const [isEditing, setIsEditing] = React.useState(false)
  const [isFavorited, setIsFavorited] = React.useState(false)
  const [slateEditorContent, setSlateEditorContent] = useState<SlateNode[]>(initialEditorValue)
  const [entityIsUpdating, setEntityIsUpdating] = React.useState(false)
  const nameUpdateTimeoutRef = React.useRef<number>()
  const [obRelCreateModalOpen, setObRelCreateModalOpen] = React.useState(false)

  const incrementWaiters = useNotificationStore(notifMutators.incrementWaiters)
  const decrementWaiters = useNotificationStore(notifMutators.decrementWaiters)

  const setEntityClass = useAtom(entityClassAtom)[1]

  React.useEffect(() => {
    incrementWaiters()
    setTimeout(() => {
      decrementWaiters()
    }, 500)
  }, [entityId])

  const rehydrateEntity = React.useCallback(async (entityId: string) => {
    await serverActions.rehydrateEntity(
      entityId,
      (entity: EntityHeader) => {
        setEntityName(entity.name)
        setEntityNamespaceId(entity.namespaceId)
        setEntityDeprecated(entity.isDeprecated)
      },
      setSlateEditorContent,
      () => {},
      incrementWaiters,
      decrementWaiters,
      setEntityClass,
    )
  }, [])

  const rehydrateClassesAndEntity = React.useCallback(async (entityId: string) => {
    // const res = await classApi.getAllEntityClasses()
    // setEntityClasses(res.Classes);
    await rehydrateEntity(entityId)
  }, [])

  const initFavorited = React.useCallback(async (entityId: string) => {
    await serverActions.getUserFavoritesForTarget(entityId, (favs: UserFavorite[]) => {
      favs.forEach((x) => {
        if (x.targetId === props.entityId) {
          setIsFavorited(true)
          return
        }
      })
    })
  }, [])

  useEffect(() => {
    if (props.entityId != null) {
      setEntityId(props.entityId)
      void initFavorited(props.entityId)
      void rehydrateClassesAndEntity(props.entityId)
    }
  }, [props.entityId])

  const doEntityNameUpdate = React.useCallback(
    async (newName: string) => {
      if (entityId == null) return

      window.clearTimeout(nameUpdateTimeoutRef.current)
      setEntityIsUpdating(true)

      nameUpdateTimeoutRef.current = window.setTimeout(() => {
        if (
          entityMemoryState.nameUpdatePending &&
          !entityMemoryState.nameIsUpdating &&
          entityId != null
        ) {
          entityMemoryState.nameIsUpdating = true
          void EntityHeaderService.updateEntityName(entityId, newName).then((x) => {
            entityMemoryState.nameUpdatePending = false
            entityMemoryState.nameIsUpdating = false
            setEntityIsUpdating(false)
          })
        }
      }, 500)
    },
    [
      entityId,
      entityNamespaceId,
      entityMemoryState.nameIsUpdating,
      entityMemoryState.nameUpdatePending,
    ],
  )

  const createNewEntity = React.useCallback(
    async (name: string, callback: (newEntityId: string) => void) => {
      const newEntity = await EntityHeaderService.createEntity(name, user.defaultNamespaceId)
      setEntityId(newEntity._id)
      callback(newEntity._id)
      setEntityName(name)
      void Reach.navigate(`/item/${newEntity._id}`)
    },
    [user.defaultNamespaceId],
  )

  return (
    <ErrorBoundary regionName="Entity Panel">
      {obRelCreateModalOpen && (
        <OutboundRelationCreateModal
          defaultNamespaceId={user.defaultNamespaceId}
          sourceEntityName={entityName}
          sourceEntityId={entityId}
          okCallback={() => {
            setObRelCreateModalOpen(false)
          }}
          cancelCallback={() => {
            setObRelCreateModalOpen(false)
          }}
        />
      )}
      <Box
        id="entity-panel-wrapper"
        className={css`
          display: flex;
          flex-direction: column;
          height: 100%;
        `}
      >
        <Box id="top-wrapper" flex="0 0 8rem">
          <EntityHeaderComponent
            rehydrateEntityFromServer={() => rehydrateEntity(props.entityId || '')}
            isUpdating={entityIsUpdating}
            setIsFavorited={setIsFavorited}
            isFavorited={isFavorited}
            isEditing={isEditing}
            entityName={entityName}
            setEntityName={(name: string) => {
              setEntityName(name)
              entityMemoryState.nameUpdatePending = true
              void doEntityNameUpdate(name)
            }}
            setIsEditing={setIsEditing}
            createNewEntity={createNewEntity}
          />
        </Box>
        <Box
          id="bottom-wrapper"
          className={css`
            flex: 1 0 20vh;
            display: flex;
            flex-direction: row;
            border-top: 1px solid lightgrey;
          `}
        >
          <Box
            id="editor-container"
            className={css`
              flex: 0 0 60vw;
            `}
          >
            <EntitySlateEditor
              triggerOutboundRelationCreate={() => {
                setObRelCreateModalOpen(true)
              }}
              setEditorContent={(content: any) => {
                setSlateEditorContent(content)

                if (props.entityId != null) EntityDocService.saveLocalDraft(props.entityId, content)
              }}
              isEditing={isEditing}
              slateEditorContent={slateEditorContent}
            />
          </Box>
          <Box
            id="item-facts-container"
            className={css`
              width: 100%;
              border-left: 1px solid lightgrey;
              padding: 25px;
            `}
          >
            <EntityRightContextItems
              entityId={entityId}
              entityModificationProps={{}}
              setOutboundRelationCreateOpen={setObRelCreateModalOpen}
            />
            {/* Footer */}
          </Box>
        </Box>
      </Box>
    </ErrorBoundary>
  )
}
