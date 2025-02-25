#!/bin/bash


# Obtener la imagen de docker cypress-agilgob mas reciente   
DOCKER_IMAGE=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep "cypress-agilgob:")
docker run --rm \
    -e SPEC=cypress/e2e/Ciudadano/001*.cy.js \
    $DOCKER_IMAGE