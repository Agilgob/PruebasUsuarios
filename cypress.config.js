import { defineConfig } from 'cypress';
import dotenv from 'dotenv';
import fs from 'fs';
import { parseFunctionary, parseCitizen, parseEnvironment } from './cypress/utilities/config.js';

// const envFile = `.env.${process.env.ENV || 'sandbox'}`;

// if (fs.existsSync(envFile)) {
//   dotenv.config({ path: envFile });
// } else {
//   throw new Error(`Archivo de entorno ${envFile} no encontrado`);
// }

if (!process.env.ENVIRONMENT) throw new Error('ENVIRONMENT no está definida');
if (!process.env.FUNCTIONARY) throw new Error('La variable de entorno FUNCTIONARY no está definida');
if (!process.env.CITIZEN) throw new Error('La variable de entorno CITIZEN no está definida');

export default defineConfig({
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

  e2e: {},

  defaultCommandTimeout: 10000,
  video: true,
  videoCompression: 32,
  videosFolder: 'tmp/videos',
  screenshotsFolder: 'tmp/screenshots',
  downloadsFolder: 'tmp/downloads',
  trashAssetsBeforeRuns: false,
  redirectionLimit: 100,
  
  env: {
    funcionario: parseFunctionary(process.env.FUNCTIONARY ),
    ciudadano: parseCitizen(process.env.CITIZEN),
    environment: parseEnvironment(),
    tramite: 'civiles_familiares_mercantiles_abogado_demandado',
    allVars : process.env
  },
});
