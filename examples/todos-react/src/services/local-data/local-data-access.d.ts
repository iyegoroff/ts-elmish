export const DataAccess: {
  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly getItem: (key: string) => Promise<string | null>
  readonly setItem: (key: string, value: string) => Promise<unknown>
}

export type DataAccess = typeof DataAccess
