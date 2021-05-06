export const current = () => window.location.hash

// eslint-disable-next-line functional/immutable-data
export const change = (hash: string) => (window.location.hash = hash)

export const listenChanges = (onChange: (hash: string) => unknown) => {
  const listener = () => {
    // eslint-disable-next-line functional/no-expression-statement
    onChange(location.hash.replace(/^#\//, ''))

    return () => window.removeEventListener('hashchange', listener)
  }

  return window.addEventListener('hashchange', listener)
}
