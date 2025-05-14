FROM cypress-cjj-base

# RUN apt-get update && apt-get install -y \
#     libgtk-3-0 \
#     xvfb \
#     zip \
#     curl \
#     tree \
#     && rm -rf /var/lib/apt/lists/*

WORKDIR /home/PruebasUsuarios

COPY . .

# RUN npm install
# RUN npx cypress install
# RUN npx playwright install --with-deps chromium

RUN chmod +x entrypoint/demanda-inicial.sh && \
    chmod +x entrypoint/exploratorios.sh && \
    chmod +x entrypoint/konami.sh && \
    chmod +x entrypoint/penal.sh && \
    chmod +x entrypoint/sendReport.sh && \
    chmod +x entrypoint.sh

USER root
CMD ["bash", "-c", "./entrypoint.sh && exit $?"]
