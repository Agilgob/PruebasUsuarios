FROM node:18-slim

# Establece el directorio de trabajo
WORKDIR /home

# Instala dependencias de sistema
RUN apt-get update && apt-get install -y \
    libgtk-3-0 \
    xvfb \
    zip \
    curl \
    tree \
    && rm -rf /var/lib/apt/lists/*


# Copia los archivos de configuración
COPY . .

# Instala dependencias de Node.js
RUN npm install && \
    npx cypress install && \
    npx playwright install --with-deps chromium

# habilita modo de ejecucion a todos los scripts
RUN find entrypoint/ -type f -exec chmod +x {} \; && \
    chmod +x entrypoint.sh

USER root
CMD ["bash", "-c", "./entrypoint.sh && exit $?"]
