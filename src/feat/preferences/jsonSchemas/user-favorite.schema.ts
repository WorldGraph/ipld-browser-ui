import { JSONSchema7 } from 'json-schema'

export const UserFavoriteSchema: JSONSchema7 = {
  title: 'UserFavorite',
  type: 'object',
  required: ['_id', 'targetId', 'type'],
  properties: {
    _id: {
      type: 'string',
      description: '_id',
    },
    targetId: {
      type: 'string',
      description: 'targetId',
    },
    type: {
      type: 'string',
      description: 'User favorite type',
    },
  },
}

export const UserFavoriteIndexedFields = [['_id'], ['targetId']]
