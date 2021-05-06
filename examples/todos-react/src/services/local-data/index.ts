import { load, update, listenChanges } from './local-data'
import { DataAccess } from './local-data-access'

export const LocalData = {
  load: load(DataAccess.getItem),
  update: update(DataAccess.setItem),
  listenChanges
} as const
