import { JSONSchema7 } from 'json-schema'

export const EntityDocumentSchema: JSONSchema7 = {
  title: 'EntityDocument',
  type: 'object',
  required: ['_id', 'documentJson'],
  properties: {
    _id: {
      type: 'string',
      description: 'Entity ID',
    },
    documentJson: {
      type: 'string',
      description: 'Document JSON',
    },
  },
}
