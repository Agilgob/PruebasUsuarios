import { defineConfig } from 'cypress';
import dotenv from 'dotenv';
import fs from 'fs';
import { parseFunctionary, parseCitizen, parseEnvironment } from './cypress/utilities/config.js';

if (!process.env.ENVIRONMENT) throw new Error('La variable ENVIRONMENT no está definida !!!!!!!!!!!!!!!!!!!!');
if (!process.env.FUNCTIONARY) throw new Error('La variable FUNCTIONARY no está definida !!!!!!!!!!!!!!!!!!!!');
if (!process.env.CITIZEN) throw new Error(' La variable CITIZEN no está definida !!!!!!!!!!!!!!!!!!!!');

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

  e2e: {
    async setupNodeEvents(on, config) {
      const mochawesome = await import('cypress-mochawesome-reporter/plugin.js');
      mochawesome.default(on); 
      return config;
    }
  },

  defaultCommandTimeout: 15000,
  video: false,
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
