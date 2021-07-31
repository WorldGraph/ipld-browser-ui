import { repoMgr } from '../../../common/storage/repos/repo-manager.service'
import { EntityClass } from '../../class/models/entity-class.model'
import { EntityClassService } from '../../class/services/entity-class.service'
import { EntityDocument } from '../../entity/model/entity-document.model'
import { EntityHeader } from '../../entity/model/entity-header.model'
import { EntityDocService } from '../../entity/services/entity-doc.service'
import { EntityHeaderService } from '../../entity/services/entity-header.service'
import { EntityRelation } from '../../entity_relation/model/entity-relation.model'
import { EntityRelationService } from '../../entity_relation/services/entity-relation.service'
import { UserFavorite } from '../../preferences/models/user-favorite.model'
import { UserFavoritesService } from '../../preferences/services/user-favorites.service'
import { Relation } from '../../relation/models/relation.model'
import { RelationService } from '../../relation/services/relation.service'

export interface DataExport {
  entHeaders: EntityHeader[]
  relations: Relation[]
  entRelations: EntityRelation[]
  entDocuments: EntityDocument[]
  entClasses: EntityClass[]
  favorites: UserFavorite[]
}

export class ImportExportService {
  /**
   * Export all data into a file
   * https://stackoverflow.com/questions/45831191/generate-and-download-file-from-js
   */
  static async exportData() {
    // TODO - figure out how to stream exported data?
    const entHeaders = await EntityHeaderService.getAllEntityHeaders()
    const relations = await RelationService.getAllRelations()
    const entRelations = await EntityRelationService.getAllEntityRelations()
    const entDocuments = await EntityDocService.getAllEntityDocs()
    const entClasses = await EntityClassService.getAllClasses()
    const favorites = await UserFavoritesService.getAllFavorites()

    const dataExport: DataExport = {
      entHeaders,
      relations,
      entRelations,
      entDocuments,
      entClasses,
      favorites,
    }

    this.download(`export.json`, JSON.stringify(dataExport))
  }

  static download(filename: string, text: string) {
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', filename)

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
  }

  static async ImportData(fileContents: string) {
    try {
      const imported = JSON.parse(fileContents) as DataExport
      console.log(`to import`, imported)

      await repoMgr.entHeaders.upsertMany(imported.entHeaders)
      await repoMgr.relations.upsertMany(imported.relations)
      await repoMgr.entRelations.upsertMany(imported.entRelations)
      await repoMgr.entDocuments.upsertMany(imported.entDocuments)
      await repoMgr.classes.upsertMany(imported.entClasses)
      await repoMgr.userFavorites.upsertMany(imported.favorites)

      //
    } catch (err) {
      console.error(`Could not process file import!`)
      throw err
    }
  }
}
