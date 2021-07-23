import { CloseButton } from '@chakra-ui/react'
import Ajv from 'ajv'
import { JSONSchema7 } from 'json-schema'
import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
import PouchDBSearch from 'pouchdb-quick-search'
import { NotImplementedException } from '../../exceptions/not-implemented.exception'
PouchDB.plugin(PouchDBFind)
PouchDB.plugin(PouchDBSearch)

export interface ValidPouchType {
  _id: string
  _rev?: string
}

export class Repository<T extends ValidPouchType> {
  private validator: any
  private db: PouchDB.Database
  constructor(public schema: JSONSchema7, public dbName: string) {
    const ajv = new Ajv()
    this.validator = ajv.compile(schema)
    this.db = new PouchDB(dbName)
  }

  /**
   *
   */
  public async update(item: T): Promise<T> {
    try {
      //       item._rev = new Date().getTime().toString()
      const res = await this.db.put(item, { schemaValidator: this.validator } as any)
      console.log(`new revision is ${res.rev}`)
      if (!res.ok) {
        throw new Error(`could not upsert item ${item._id}! tried to set rev to ${item._rev}`)
      }
      return item
    } catch (err) {
      console.error(`Error in update function of database ${this.dbName}`)
      console.error(`could not upsert item ${item._id}! tried to set rev to ${item._rev}`)
      throw err
    }
  }

  public async create(item: T): Promise<T> {
    console.log(`creating item`, item)
    //     item._rev = new Date().getTime().toString()
    if (item._rev) {
      delete item._rev
    }

    console.log(`creating`, item)
    const res = await this.db.put(item, {
      schemaValidator: this.validator,
    } as any)
    if (!res.ok) {
      throw new Error(`could not upsert item ${item._id}!`)
    }
    return item
  }

  public async findById(id: string): Promise<T | null> {
    try {
      return await this.db.get(id)
    } catch (err) {
      console.error(`Could not find id ${id}, in database ${this.dbName}! Returning null`)
      return null
    }
  }

  public async deleteById(id: string, rev: string): Promise<void> {
    await this.db.remove(id, rev)
  }

  public async delete(item: T): Promise<void> {
    if (!item._rev) {
      throw new Error(`Rev must be provided to delete a document!`)
    }

    await this.db.remove(item as any)
  }

  public async deleteMany(items: T[]): Promise<void> {
    for (const item of items) {
      await this.delete(item)
    }
  }

  public async getAll(): Promise<T[]> {
    const res = (await this.db.allDocs({ include_docs: true, attachments: true })) as any
    console.log(`response from alldocs for database ${this.dbName}`, res)
    const refined = res.rows.map((row: any) => row.doc)

    return refined as T[]
  }

  public async find(filter: any): Promise<T[]> {
    const res = await this.db.find({
      selector: filter,
    })

    if (res.warning) {
      console.warn(`Warning on db ${this.dbName}: ${res.warning}`)
      console.warn(`searched: `, filter)
    }

    return res.docs as T[]
  }

  public async count() {
    const info = await this.db.info()
    return info.doc_count
  }

  public async fullTextSearch(
    fields: string[],
    searchString: string,
    pageSize = 10,
    pageNumber = 0,
  ): Promise<T[]> {
    const dbany = this.db as any
    try {
      const res = await dbany.search({
        query: searchString,
        fields: [fields],
        include_docs: true,
        limit: pageSize,
        skip: pageSize * pageNumber,
      })
      if (res?.rows?.length > 0) {
        const refinedRows = res.rows.map((row: any) => {
          return row.doc
        })
        return refinedRows
      } else {
        return []
      }
    } catch (err) {
      console.error(`ERROR in fullTextSearch, dbname ${this.dbName}`)
      throw err
    }
  }

  public async createIndexes(fieldGroups: string[][]) {
    for (const group of fieldGroups) {
      await this.db.createIndex({ index: { fields: group } })
    }
  }
}
