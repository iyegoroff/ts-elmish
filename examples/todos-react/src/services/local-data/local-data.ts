import mitt from 'mitt'
import { isDefined } from 'ts-is-defined'
import { DataAccess } from './local-data-access'

type Change = {
  readonly key: string
  readonly value: unknown
}

const emitter = mitt<{
  readonly change: Change
}>()

export const load =
  (getItem: DataAccess['getItem']) =>
  <T>(key: string, defaultValue: NonNullable<T>) =>
    getItem(key).then((value) => (isDefined(value) ? (JSON.parse(value) as unknown) : defaultValue))

export const update =
  (setItem: DataAccess['setItem']) =>
  <T>(key: string, value: NonNullable<T>) =>
    setItem(key, JSON.stringify(value)).then(() => emitter.emit('change', { key, value }))

export const listenChanges = (key: string, onChange: (value: unknown) => undefined) => {
  const listener = (change: Change) => (change.key === key ? onChange(change.value) : undefined)

  // eslint-disable-next-line functional/no-expression-statement
  emitter.on('change', listener)

  return () => emitter.off('change', listener)
}
