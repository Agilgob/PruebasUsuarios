const { defineConfig } = require("cypress");
const dotenv = require("dotenv");
const fs = require("fs");


const envFile = `.env.${process.env.ENV || 'sandbox'}`;

if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
} else {
    throw new Error(`Archivo de entorno ${envFile} no encontrado`);
}

const FUNCTIONARY_KEY = process.env.FUNCTIONARY || 'SECRETARIO_ACUERDOS_01';
const functionaryRaw = process.env[FUNCTIONARY_KEY];

const CITIZEN_KEY = process.env.CITIZEN || "CIUDADANO_MANUEL";
const citizenRaw = process.env[CITIZEN_KEY];

const environmentRaw = process.env.ENVIRONMENT;

if (!functionaryRaw || !citizenRaw || !environmentRaw) {
    const error = `functionaryRaw: ${functionaryRaw}, citizenRaw: ${citizenRaw}, environmentRaw: ${environmentRaw}`;
  throw new Error(error);
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
  redirectionLimit: 100,
  
  env : {
    funcionario: JSON.parse(functionaryRaw),
    ciudadano: JSON.parse(citizenRaw),
    environment: JSON.parse(environmentRaw),
    tramite: "civiles_familiares_mercantiles_abogado_demandado"
  }

});
