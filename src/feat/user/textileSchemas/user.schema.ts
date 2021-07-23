import { JSONSchema7 } from 'json-schema'

export const UserSchema: JSONSchema7 = {
  title: 'User',
  type: 'object',
  required: ['_id', 'publicKey', 'userName'],
  properties: {
    _id: {
      type: 'string',
      description: 'User ID',
    },
    publicKey: {
      type: 'string',
      description: 'publicKey',
    },
    userName: {
      type: 'string',
      description: 'userName',
    },
    email: {
      type: 'string',
      description: 'email',
    },
    firstName: {
      type: 'string',
      description: 'firstName',
    },
    lastName: {
      type: 'string',
      description: 'lastName',
    },
    defaultNamespaceId: {
      type: 'string',
      description: 'defaultNamespaceId',
    },
  },
}
