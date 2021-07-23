import { EntityDocument } from '../model/entity-document.model'
import * as _ from 'lodash'
import { repoMgr } from '../../../common/storage/repos/repo-manager.service'

export class EntityDocService {
  static saveLocalDraftImmediate = (entId: string, docDraft: Record<string, unknown>) => {
    localStorage.setItem(`draft-${entId}`, JSON.stringify(docDraft))
  }

  static saveLocalDraft = _.throttle(EntityDocService.saveLocalDraftImmediate, 1000, {
    leading: false,
    trailing: true,
  })

  static getLocalDraft = (entId: string): string | null => {
    return localStorage.getItem(`draft-${entId}`)
  }

  static deleteLocalDraft = (entId: string) => {
    localStorage.removeItem(`draft-${entId}`)
  }

  static getDocument = async (entityId: string): Promise<EntityDocument | null> => {
    const doc = await repoMgr.entDocuments.findById(entityId)
    if (doc == null) return null

    return doc
  }

  static saveDocument = async (entId: string, documentJson: string) => {
    // First check if the doc already exists
    try {
      const existing = await EntityDocService.getDocument(entId)
      if (existing == null) {
        await repoMgr.entDocuments.create({
          _id: entId,
          _rev: '1',
          documentJson: documentJson,
        })
        // await instance.save()
      } else {
        await repoMgr.entDocuments.update({
          _id: entId,
          _rev: '',
          documentJson: documentJson,
        })
      }
    } catch (err) {
      console.error(`Error saving document draft`, err)
      throw err
    }
  }

  static flushLocalDraft = async (entId: string) => {
    const draft = EntityDocService.getLocalDraft(entId)
    if (draft == null) return

    await EntityDocService.saveDocument(entId, draft)
    EntityDocService.deleteLocalDraft(entId)
  }
}
