# Use Node.js image
FROM node:20

# Install dependencies like ffmpeg
RUN apt-get update && apt-get install -y ffmpeg unzip curl && rm -rf /var/lib/apt/lists/*

# Install Chromium and dependencies
RUN apt-get update && apt-get install -y chromium

# Set environment variable for Remotion to find Chromium
ENV REMOTION_CHROME_EXECUTABLE=/usr/bin/chromium

# Set working directory
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install deps
RUN npm install

# Copy the rest of the app
COPY . .

# Ensure cmake is installed
RUN apt-get update && apt-get install -y cmake

# Ensure whisper.cpp is unzipped + model is downloaded (only if missing)
RUN if [ ! -d "./server/subtitle/whisper.cpp" ]; then \
      unzip ./server/subtitle/whisper.cpp-1.5.5.zip -d ./server/subtitle/whisper.cpp; \
    fi && \
    sh ./server/subtitle/whisper.cpp/models/download-ggml-model.sh small.en && \
    cd ./server/subtitle/whisper.cpp && \
    cmake -B build && \
    cmake --build build --config Release

# Expose dev ports
EXPOSE 5173 9000

# Run in dev mode
CMD ["npm", "run", "dev"]