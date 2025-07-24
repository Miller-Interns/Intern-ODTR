# --- Stage 1: The Builder ---
# This stage installs all dependencies and builds the application.
FROM node:20 AS builder
WORKDIR /app

COPY . .
RUN rm -rf node_modules package-lock.json
RUN npm install

RUN npx prisma generate
RUN npm run build


# --- Stage 2: The Final Production Image ---
# This stage creates the final, small, and clean image to run the app.
FROM node:20
WORKDIR /app

# --- THIS IS THE FIX ---
# Copy package.json AND the generated package-lock.json from the builder.
# The wildcard '*' copies both files.
COPY --from=builder /app/package*.json ./

# Now `npm ci` will work because the package-lock.json exists.
RUN npm ci --omit=dev

# Copy the prisma schema from the builder stage
COPY --from=builder /app/prisma ./prisma

# Generate the Prisma Client AGAIN in the final production stage.
RUN npx prisma generate

# Copy the already-built application from the builder stage
COPY --from=builder /app/.output ./.output

# Expose the port and set the start command
EXPOSE 3000
CMD [ "node", ".output/server/index.mjs" ]