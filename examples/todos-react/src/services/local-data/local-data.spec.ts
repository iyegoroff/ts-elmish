/* eslint-disable no-null/no-null */

import { Any } from 'ts-toolbelt'
import { resolver } from '../../test-util'
import { load, listenChanges, update } from './local-data'

type Load = Any.PromiseType<ReturnType<ReturnType<typeof load>>>
type Update = Any.PromiseType<ReturnType<ReturnType<typeof update>>>

const key = 'key' as const

describe('services > local-data', () => {
  test('load - success', async () => {
    expect(await load(resolver(JSON.stringify(10)))(key, 5)).toEqual<Load>(10)
  })

  test('loadWithDefault - success', async () => {
    expect(await load(resolver(JSON.stringify(10)))(key, 1)).toEqual<Load>(10)
  })

  test('loadWithDefault - item-not-found', async () => {
    expect(await load(resolver(null))(key, 25)).toEqual<Load>(25)
  })

  test('load - item-not-found', async () => {
    expect(await load(resolver(null))(key, 3)).toEqual<Load>(3)
  })

  test('load - throw', async () => {
    const error = new Error('reject')

    return await expect(load(() => Promise.reject(error))(key, 5)).rejects.toEqual(error)
  })

  test('loadWithDefault - throw', async () => {
    const error = new Error('reject')

    return await expect(load(() => Promise.reject(error))(key, 25)).rejects.toEqual(error)
  })

  test('update - success', async () => {
    const items: Record<string, string> = {}

    expect(
      await update((k, value) => {
        // eslint-disable-next-line functional/no-expression-statement, functional/immutable-data
        items[k] = value

        return Promise.resolve()
      })(key, 10)
    ).toEqual<Update>(undefined)

    expect(items).toEqual({ key: '10' })
  })

  test('listenChanges', async () => {
    const onChange = jest.fn((value: unknown) => value)
    const onChangeWrong = jest.fn((value: unknown) => value)
    const unsubscribe = listenChanges(key, onChange)
    const unsubscribeWrong = listenChanges('wrong', onChangeWrong)

    expect(await update(resolver(undefined))(key, 10)).toEqual<Update>(undefined)

    expect(onChange).toReturnWith(10)

    expect(unsubscribe()).toBeUndefined()
    expect(unsubscribeWrong()).toBeUndefined()

    expect(await update(resolver(undefined))(key, 20)).toEqual<Update>(undefined)

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChangeWrong).not.toHaveBeenCalled()
  })
})
