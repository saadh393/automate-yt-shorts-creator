FROM jrottenberg/ffmpeg:6.1-ubuntu as ffmpeg
FROM node:20-slim

# Install ffmpeg
COPY --from=ffmpeg /usr/local /usr/local

WORKDIR /app

# Copy Package.jsons
COPY package.json ./
RUN npm install


# Copy rest of the codes

COPY . .

# Ensure the public directory persists
VOLUME ["/app/public"]

#Expose necessary Ports 
EXPOSE 5173 9000

CMD ["npm", "run", "dev"]