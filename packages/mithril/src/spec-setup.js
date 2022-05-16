import jsdom from 'jsdom'

let dom = new jsdom.JSDOM('', { pretendToBeVisual: true })

globalThis.window = dom.window
globalThis.document = dom.window.document
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame
