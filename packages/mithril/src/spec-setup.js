global.window = Object.assign(
  require('mithril/test-utils/domMock.js')(),
  require('mithril/test-utils/pushStateMock')()
)
global.requestAnimationFrame = (callback) => global.setTimeout(callback, 1000 / 60)
