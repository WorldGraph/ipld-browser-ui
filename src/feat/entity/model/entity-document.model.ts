export interface EntityDocument {
  _id: string
  _rev: string
  documentJson: string
}

export const blankEntityDocument: EntityDocument = {
  _id: '',
  _rev: '',
  documentJson: '',
}
