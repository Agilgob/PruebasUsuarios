// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })


// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })


// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })


// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import './commands-functionary/home';
import '../page/functionary/expediente';
import './commands-functionary/login';
import './commands-functionary/modal';

import '../page/citizen/expedientes';
import '../page/citizen/login';
import '../page/citizen/PageHome';

import './commands-functionary/overwrite'
import './commands-functionary/fill-form-fields';
import './commands-functionary/iframe';
import './faker'


