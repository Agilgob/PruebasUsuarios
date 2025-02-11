#!/bin/bash

# Obtener el SHA del último commit (primeros 15 caracteres)
HASH=$(git rev-parse HEAD | cut -c1-15)
IMAGE_NAME="cypress-agilgob:$HASH"

# Verificar si existe una imagen con el mismo SHA
EXISTING_IMAGE=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep "cypress-agilgob:" | awk -F: '{print $2}')

if [[ -z "$EXISTING_IMAGE" ]]; then
    echo "No hay una imagen previa. Construyendo $IMAGE_NAME ..."
    docker build --no-cache -t $IMAGE_NAME -f Dockerfile .
else
    if [[ "$EXISTING_IMAGE" == "$HASH" ]]; then
        echo "La imagen actual ya está actualizada con el hash $HASH. No es necesario construir."
    else
        echo "Eliminando imagen previa: cypress-agilgob:$EXISTING_IMAGE"
        docker rmi "cypress-agilgob:$EXISTING_IMAGE"
        echo "Construyendo nueva imagen: $IMAGE_NAME"
        docker build --no-cache -t $IMAGE_NAME -f Dockerfile .
    fi
fi
