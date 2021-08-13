import { JSONSchema7 } from 'json-schema'

export const NamespaceSchema: JSONSchema7 = {
  title: 'Namespace',
  type: 'object',
  required: ['_id', 'name', 'owningUser'],
  properties: {
    _id: {
      type: 'string',
      description: 'User ID',
    },
    name: {
      type: 'string',
      description: 'name',
    },
    owningUser: {
      type: 'string',
      description: 'owningUser',
    },
  },
}
