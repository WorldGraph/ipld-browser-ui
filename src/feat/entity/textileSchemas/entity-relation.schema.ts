import { JSONSchema7 } from 'json-schema'

export const EntityRelationSchema: JSONSchema7 = {
  title: 'EntityRelation',
  type: 'object',
  required: ['_id', 'relationId', 'sourceId', 'targetId'],
  properties: {
    _id: {
      type: 'string',
      description: '_id',
    },
    relationId: {
      type: 'string',
      description: 'relationId',
    },
    sourceId: {
      type: 'string',
      description: 'sourceId',
    },
    targetId: {
      type: 'string',
      description: 'targetId',
    },
  },
}

export const EntityRelationIndexedFields = [['_id'], ['relationId'], ['sourceId'], ['targetId']]
