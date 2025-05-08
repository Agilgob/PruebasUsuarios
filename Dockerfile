FROM node:18


RUN apt-get update && apt-get install -y \
    libgtk-3-0 \
    # libgtk2.0-0 \
    # libgbm-dev \
    # libnotify-dev \
    # libgconf-2-4 \
    # libnss3 \
    # libxss1 \
    # libasound2 \
    # libxtst6 \
    xvfb \
    zip \
    curl \
    tree \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /home

# ARG REPO_URL
# ARG REPO_BRANCH
# RUN git clone $REPO_URL --branch $REPO_BRANCH 
# WORKDIR /home/PruebasUsuarios

COPY . .

RUN npm install
RUN npx cypress install
RUN npx playwright install --with-deps chromium

RUN chmod +x entrypoint/runCypress.sh && \
    chmod +x entrypoint/runPlaywright.sh && \
    chmod +x entrypoint/runSenderReports.sh \
    && chmod +x entrypoint.sh

USER root
CMD ["bash", "-c", "./entrypoint.sh && exit $?"]


# docker build -t test-cjj -f Dockerfile --build-arg REPO_URL=$REPO_URL --build-arg REPO_BRANCH=$REPO_BRANCH . && docker run --name test-cjj --rm test-cjj
