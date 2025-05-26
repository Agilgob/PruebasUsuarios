FROM node:18-slim

# Establece el directorio de trabajo
WORKDIR /home

# # Instala dependencias de sistema
RUN apt-get update && apt-get install -y \
    libgtk-3-0 \
    xvfb \
    zip \
    curl \
    tree \
    gnupg \
    && rm -rf /var/lib/apt/lists/*


# # Copia los archivos de configuración
COPY . .

# Instala dependencias de Node.js
RUN npm install && \
    npx cypress install && \
    npx playwright install --with-deps chromium

# habilita modo de ejecucion a todos los scripts de shell
RUN find entrypoint/ -type f -exec chmod +x {} \; && \
    chmod +x entrypoint.sh


## Instalacion de k6
RUN gpg -k && \
    gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg \ 
        --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69 && \
    echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | tee /etc/apt/sources.list.d/k6.list && \
    apt-get update && \
    apt-get install k6


USER root
CMD ["bash", "-c", "./entrypoint.sh && exit $?"]
