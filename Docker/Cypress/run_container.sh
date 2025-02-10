#!/bin/bash


# Obtener la imagen de docker cypress-agilgob mas reciente   
DOCKER_IMAGE=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep "cypress-agilgob:")
$DOCKER_IMAGE