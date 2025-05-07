const { defineConfig } = require('cypress');
const dotenv = require('dotenv');
const fs = require('fs');
const { parseFunctionary, parseCitizen, parseEnvironment } = require('./cypress/utilities/config.js');

const envFile = `.env.${process.env.ENV || 'sandbox'}`;

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
} else {
  throw new Error(`Archivo de entorno ${envFile} no encontrado`);
}

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
    reportFilename: '[status]-[name]',
    debug: true,
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
  screenshotsFolder: 'tmp/screenshots',
  downloadsFolder: 'tmp/downloads',
  trashAssetsBeforeRuns: false,
  redirectionLimit: 100,
  
  env: {
    funcionario: parseFunctionary(process.env.FUNCTIONARY || 'FUNC_LABORAL_ACUERDOS_01'),
    ciudadano: parseCitizen(process.env.CITIZEN || 'CIUDADANO_MANUEL'),
    environment: parseEnvironment(),
    tramite: 'civiles_familiares_mercantiles_abogado_demandado',
  },
});
