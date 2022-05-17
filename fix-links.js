const { promisify } = require('util')
const {
  promises: { readlink, symlink, unlink, lstat },
  existsSync
} = require('fs')
const process = require('process')
const glob = promisify(require('glob'))

glob('packages/*/node_modules/@ts-elmish/*')
  .then((files) => Promise.all(files.map((file) => readlink(file).then((link) => [link, file]))))
  .then((links) =>
    Promise.all(
      links.map(([target, path]) =>
        existsSync(path)
          ? undefined
          : unlink(path).then(() => symlink(`../../${target}`, `${path}`))
      )
    )
  )
  .catch((err) => {
    console.log(err.message)
    process.exitCode = 1
  })
