const fixedLocation = (location: Location) => location.hash.replace(/^#\//, '')

export const current = () => fixedLocation(window.location)

export const change = (hash: string) =>
  // eslint-disable-next-line functional/immutable-data
  (window.location.hash = hash.startsWith('#/') ? hash : `#/${hash}`)

export const listenChanges = (onChange: (hash: string) => unknown) => {
  const listener = () => {
    // eslint-disable-next-line functional/no-expression-statement
    onChange(fixedLocation(window.location))

    return () => window.removeEventListener('hashchange', listener)
  }

  return window.addEventListener('hashchange', listener)
}
