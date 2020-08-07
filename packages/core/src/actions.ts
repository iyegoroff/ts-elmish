const map = <T, U>(name: U) => (action: T): readonly [U, T] => [name, action]

const mapArg = <T, U, Arg>(name: U, arg: Arg) => (action: T): readonly [U, Arg, T] => [
  name,
  arg,
  action
]

export const Actions = {
  map,
  mapArg
} as const
