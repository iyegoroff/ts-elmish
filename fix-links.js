const { promisify } = require('util')
const fs = require('fs')
const process = require('process')
const glob = promisify(require('glob'))

const readlink = promisify(fs.readlink)
const symlink = promisify(fs.symlink)
const unlink = promisify(fs.unlink)

glob('packages/*/node_modules/@ts-elmish/*')
  .then((files) => Promise.all(files.map((file) => readlink(file).then((link) => [link, file]))))
  .then((links) =>
    Promise.all(
      links.map(([target, path]) => unlink(path).then(() => symlink(`../../${target}`, `${path}`)))
    )
  )
  .catch((err) => {
    console.log(err.message)
    process.exitCode = 1
  })
