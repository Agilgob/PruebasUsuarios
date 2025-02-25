#!/bin/bash


# Obtener la imagen de docker cypress-agilgob mas reciente   
DOCKER_IMAGE=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep "cypress-agilgob:")
docker run --rm \
    -e spec=cypress/e2e/Ciudadano/*.cy.js \
    -e $DOCKER_IMAGE