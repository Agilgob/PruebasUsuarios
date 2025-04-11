FROM node:18


RUN apt-get update && apt-get install -y \
    libgtk2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnotify-dev \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    xvfb \
    zip \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set terminal for tput
ENV TERM=xterm-256color 
WORKDIR /home
COPY . .
RUN npm install
RUN npx playwright install --with-deps chromium


RUN chmod +x runScripts.sh

# Run tests and exit with proper status code
CMD ["bash", "-c", "./runScripts.sh && exit $?"]


# docker build -t node18-cjj-test . --no-cache && docker run --name test-cjj --rm node18-cjj-test
