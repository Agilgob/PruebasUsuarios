FROM node:18

# Install dependencies required for Cypress and Playwright
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
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Playwright browsers with dependencies
RUN npx playwright install --with-deps chromium firefox webkit

# Copy project files
COPY . .

# Make script executable
RUN chmod +x runScripts.sh

# Run tests and exit with proper status code
CMD ["bash", "-c", "./runScripts.sh && exit $?"]
