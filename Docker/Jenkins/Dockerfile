FROM jenkins/jenkins:lts
LABEL description="Jenkins con dependencias para ejecutar pruebas en Cypress, mostrar reportes de pruebas y ejecutar Docker"

ARG DOCKER_GID=137

USER root

# Instalar dependencias, agregar repositorio de Docker y solo instalar el cliente Docker
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends apt-transport-https ca-certificates curl gnupg lsb-release && \
    install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc && \
    chmod a+r /etc/apt/keyrings/docker.asc && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" > /etc/apt/sources.list.d/docker.list && \
    apt-get update -qq && \
    apt-get install -y --no-install-recommends docker-ce docker-ce-cli docker-buildx-plugin  && \
    apt-get clean && rm -rf /var/lib/apt/lists/* 

# Cambiar el grupo de Docker para que Jenkins pueda ejecutar Docker
RUN groupmod -g ${DOCKER_GID} docker && usermod -aG docker jenkins

# Configuración para mostrar reportes de pruebas en Cypress
RUN mkdir -p /usr/share/jenkins/ref/init.groovy.d && \
    echo 'System.setProperty("hudson.model.DirectoryBrowserSupport.CSP", "");' > /usr/share/jenkins/ref/init.groovy.d/disable-csp.groovy

USER jenkins





# docker build -t agilgob-jenkins-dood --no-cache .
# docker run -d -p 8080:8080 -p 50000:50000 --name cypress-jenkins-cont -v /var/run/docker.sock:/var/run/docker.sockjenkins-plus-cypress
# docker run -d \
#   --name jenkins-docker \
#   -p 8080:8080 \
#   -p 50000:50000 \
#   -v /var/run/docker.sock:/var/run/docker.sock \
#   agilgob-jenkins-dood 