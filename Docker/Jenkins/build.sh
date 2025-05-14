#!/bin/bash

# primero convierte el archivo en ejecutable chmod +x build.sh

# Crea el volumen de datos
docker volume create jenkins-dood-vol

# Construye la imagen 
DOCKER_GID=$(getent group docker | cut -d: -f3)
docker build --build-arg DOCKER_GID=$DOCKER_GID -t agilgob-jenkins-dood-img --no-cache .

# Ejecuta el contenedor
docker run -d \
    --name jenkins-docker \
    --restart=always \
    -p 8080:8080 \
    -p 50000:50000 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v jenkins-dood-vol:/var/jenkins_home \
    agilgob-jenkins-dood-img