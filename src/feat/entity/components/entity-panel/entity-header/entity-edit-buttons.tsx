import { css, cx } from 'emotion'
import { Button } from '@chakra-ui/react'
import React from 'react'
import { MoreActionsButton } from './entity-edit-buttons/more-actions-button.component'
import { UserFavoritesService } from '../../../../preferences/services/user-favorites.service'
import { SingleTextInputModal } from '../../../../../common/components'
import { EntityDocService } from '../../../services/entity-doc.service'
import { GrAdd, GrDownload, GrEdit, GrStar, GrUpdate } from 'react-icons/gr'

export interface EntityEditButtonsProps {
  entId: string
  isEditing: boolean
  isFavorited: boolean
  rehydrateEntityFromServer: () => void
  setIsFavorited: (input: boolean) => void
  setIsEditing: (isEditing: boolean) => void
  createNewEntity: (name: string, callback: (newEntityId: string) => void) => void
  isUpdating: boolean
}

const mb15 = css`
  margin-bottom: 15px;
`

const mr20 = css`
  margin-right: 20px;
`

const saveActionBtn = css`
  width: 190px;
  ${mr20}
  ${mb15}
`

export function EntityEditButtons(props: EntityEditButtonsProps) {
  // TODO - replace this with global input modal
  const [nameInputModalOpen, setNameInputModalOpen] = React.useState(false)

  const createFavorite = React.useCallback(async () => {
    await UserFavoritesService.createFavorite(props.entId)
    props.setIsFavorited(true)
  }, [props.entId])

  const deleteFavorite = React.useCallback(async () => {
    await UserFavoritesService.deleteFavorite(props.entId)
    props.setIsFavorited(false)
  }, [props.entId])

  return (
    <>
      {nameInputModalOpen && (
        <SingleTextInputModal
          id="entity-edit-name-entry"
          heading="Name for New Item"
          hintText="Enter Name"
          okCallback={(name: string) => {
            props.createNewEntity(name, (newEntityId) => {
              setNameInputModalOpen(false)
            })
          }}
          cancelCallback={() => {
            setNameInputModalOpen(false)
          }}
        />
      )}
      <Button
        id="add-new-entity-btn"
        title="Add New"
        leftIcon={<GrAdd />}
        className={cx(mb15, mr20)}
        onClick={() => {
          setNameInputModalOpen(true)
        }}
      >
        Add new
      </Button>
      {props.isEditing && (
        <Button
          id="save-entity-changes-button"
          title="Save Changes"
          leftIcon={props.isUpdating ? <GrUpdate /> : <GrDownload />}
          className={saveActionBtn}
          // disabled={props.isUpdating}
          // label={props.isUpdating ? "Pending" : "Stop Editing"}
          onClick={() => {
            void EntityDocService.flushLocalDraft(props.entId)
            props.setIsEditing(false)
          }}
        >
          Save Changes
        </Button>
      )}
      {!props.isEditing && (
        <Button
          leftIcon={<GrEdit />}
          title="Edit"
          className={saveActionBtn}
          onClick={() => {
            props.setIsEditing(true)
          }}
        >
          Edit
        </Button>
      )}
      {!props.isFavorited && (
        <Button
          id="favorite-entity-btn"
          title="Add to Favorites"
          className={cx(mb15, mr20)}
          leftIcon={<GrStar color="#ffffff" />}
          onClick={() => void createFavorite()}
        >
          Add to Favorites
        </Button>
      )}
      {props.isFavorited && (
        <Button
          id="remove-favorite-entity-btn"
          title="Remove Favorite"
          className={cx(mb15, mr20)}
          leftIcon={<GrStar />}
          onClick={() => void deleteFavorite()}
        >
          Remove from Favorites
        </Button>
      )}
      <MoreActionsButton className={mb15} />
    </>
  )
}
