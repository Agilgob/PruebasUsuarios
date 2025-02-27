const { defineConfig } = require("cypress");
// const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');


module.exports = defineConfig({

  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'tmp',
    html: true,
    json: true,
    embeddedScreenshots: true,
    ignoreVideos: false,
    screenshotsFolder: 'tmp/screenshots',  
    videosFolder: 'tmp/videos',
    saveAllAttempts: true,
    overwrite: false,
    autoCleanReports: false,
    reportFilename : "[status]-[name]",
    debug: true    
  },

  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
  },
  
  defaultCommandTimeout: 10000,
  video: true,
  videoCompression: 32,
  videosFolder: 'tmp/videos',
  screenshotsFolder: "tmp/screenshots",
  downloadsFolder: 'tmp/downloads',
  trashAssetsBeforeRuns: false,

  env : {
    funcionario : 'secretarioAcuerdos02',
    ciudadano : 'ciudadanoManuel',
    tramite : "promocion_demanda_fam_merc",
    environment : 'sandbox'
  }

});
