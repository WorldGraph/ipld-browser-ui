import { Box, Heading } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { UserFavoritesItem } from './user-favorites-item.component'
import { widget33 } from '../styles'
import { UserFavoriteReadable } from '../../../preferences/models/UserFavoriteReadable'
import { UserFavoritesService } from '../../../preferences/services/user-favorites.service'
import { userProfileAtom } from '../../../user/stores/user.state'
import { useAtom } from 'jotai'

export function UserFavoritesPanel() {
  const [userFavorites, setUserFavorites] = React.useState<UserFavoriteReadable[]>([])
  const user = useAtom(userProfileAtom)[0]

  useEffect(() => {
    void hydrateFavorites()
  }, [user._id])

  const hydrateFavorites = React.useCallback(async () => {
    const favs = await UserFavoritesService.getAllReadable()
    setUserFavorites(favs)
  }, [])

  return (
    <Box className={widget33} bgColor="gray.50">
      <Heading size="lg">Favorites</Heading>
      {userFavorites.map((fav) => {
        return <UserFavoritesItem key={fav._id} item={fav} />
      })}
    </Box>
  )
}
