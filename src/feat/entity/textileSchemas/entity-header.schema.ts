import { JSONSchema7 } from 'json-schema'

export const EntityHeaderSchema: JSONSchema7 = {
  title: 'EntityHeader',
  type: 'object',
  required: ['_id', 'namespaceId', 'name'],
  properties: {
    _id: {
      type: 'string',
      description: 'User ID',
    },
    namespaceId: {
      type: 'string',
      description: 'namespaceId',
    },
    name: {
      type: 'string',
      description: 'name',
    },
    classId: {
      type: 'string',
      description: 'classId',
    },
    isDeprecated: {
      type: 'boolean',
      description: 'isDeprecated',
    },
    replacedBy: {
      type: 'string',
      description: 'replacedBy',
    },
  },
}
