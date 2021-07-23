import { JSONSchema7 } from 'json-schema'

export const RelationSchema: JSONSchema7 = {
  title: 'Relation',
  type: 'object',
  required: ['_id', 'namespaceId', 'name'],
  properties: {
    _id: {
      type: 'string',
      description: '_id',
    },
    namespaceId: {
      type: 'string',
      description: 'namespaceId',
    },
    name: {
      type: 'string',
      description: 'name',
    },
  },
}
