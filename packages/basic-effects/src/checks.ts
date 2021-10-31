/* istanbul ignore file */

import { Effect } from '@ts-elmish/common'

const foo = (expected: unknown) =>
  jest.fn((x: unknown) => {
    expect(x).toEqual(expected)
    return undefined
  })

export const checkEffect = (effect: Effect<unknown>, expected: unknown, idx = 0) => {
  const check = foo(expected)
  expect(effect[idx]?.(check)).toBeUndefined()
  expect(check).toReturn()
}

export const checkEffectReject = (effect: Effect<unknown>, expected: Error, idx = 0) => {
  const check = foo(expected)
  expect(() => effect[idx]?.(check)).toThrowError(expected)
  expect(check).toThrow()
}

export const checkAsyncEffect = async (effect: Effect<unknown>, expected: unknown, idx = 0) => {
  const check = foo(expected)
  await expect(Promise.resolve(effect[idx]?.(check))).resolves.toBeUndefined()
  expect(check).toReturn()
}

export const checkAsyncEffectReject = async (
  effect: Effect<unknown>,
  expected: unknown,
  idx = 0
) => {
  const check = foo(expected)
  await expect(Promise.resolve(effect[idx]?.(check))).rejects.toEqual(expected)
  expect(check).toThrow()
}
