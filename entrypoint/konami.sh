#!/bin/bash

set -e

# Ir al directorio raíz del proyecto
cd "$(dirname "$0")/.."


for i in {1..5}; do
    npx cypress run --spec cypress/e2e/Ciudadano/004_TramiteSecretarioAcuerdos.cy.js --env tramite=konami5-actor \
    --reporter-options reportFilename="konami5-actor-$i"
done

for i in {1..5}; do
    npx cypress run --spec cypress/e2e/Ciudadano/004_TramiteSecretarioAcuerdos.cy.js --env tramite=konami5-demandado \
    --reporter-options reportFilename="konami5-demandado-$i"
done

for i in {1..5}; do
    npx cypress run --spec cypress/e2e/Ciudadano/004_TramiteSecretarioAcuerdos.cy.js --env tramite=konami4-actor \
    --reporter-options reportFilename="konami4-actor-$i"
done

for i in {1..5}; do
    npx cypress run --spec cypress/e2e/Ciudadano/004_TramiteSecretarioAcuerdos.cy.js --env tramite=konami4-demandado \
    --reporter-options reportFilename="konami4-demandado-$i"
done