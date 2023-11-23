const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportHeight: 880,
  viewportWidth: 1280,
  projectId: '9dqiba',
  watchForFileChanges: false,
  e2e: {
    setupNodeEvents(on, config) { },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
  video: false
})
