const { defineConfig } = require("cypress");
require('dotenv').config({ path: './.env.prod' });
// const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');


// const environment = JSON.parse(process.env.ENVIRONMENT);
// const functionary1 = JSON.parse(process.env.FUNCTIONARY1);  
// const functionary2 = JSON.parse(process.env.FUNCTIONARY2);



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
  redirectionLimit: 100
  
  // env : {
  //   funcionario : 'secretarioAcuerdos01',
  //   ciudadano : 'ciudadanoManuel',
  //   tramite : "civiles_familiares_mercantiles_abogado_demandado",
  //   // environment : 'productivo',

  //   functionary1 : functionary1,
  //   functionary2 : functionary2,
  //   environment : environment
  // }

});
