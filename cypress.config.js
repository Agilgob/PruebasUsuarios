const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  
  defaultCommandTimeout: 5000,
  video: true,
  videoCompression: 32,
  videosFolder: 'cypress/videos',

  env : {
    funcionario : 'secretarioAcuerdos02',
    ciudadano : 'ciudadanoManuel',
    tramite : "promocion_demanda_fam_merc",
    testData : 'testDataSandbox'
  }

});
