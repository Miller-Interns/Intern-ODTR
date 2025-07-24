# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Database Migrations and Seeding

The migrations and seeding is managed by Prisma. Please refer to the [docs](https://www.prisma.io/docs/orm/prisma-migrate) for the in-depth process in working with this.

The environment variables found in the (see `/mllr-badlis-system/.env`) are currently configured with the consideration to a running Docker container. Which means it wouldn't work if the intention is to run it directly. As you what have observed from the file, the connection strings are pointing to the addresses based on the Docker container (defined in `docker-compose.yml`) and the Default Network that was made from running it while having this command `docker-compose up` is what making this work.

Moreover, running the Prisma commands within the docker container can be done in two simple ways, either use directly and enable the Docker application or do it via CLI by:

Run this command

```bash
docker compose up
```

### To create a migration and/or run migrations

```bash
pnpm prisma migrate dev
```

This will run database migrations. It will create a migration file and prompted you for a name for the migration. Make sure to double check everything before you initiate the changes.

**Important:** If you're not using Docker to run this app, you must need to configure the connection strings of the database servers (e.g. Redis, PostgreSQL) via the environment variables.

### To seed the database

```bash
pnpm prisma db seed
```

**Important:** Make sure to write idempotent seed scripts!

Resetting the database also runs the seed automatically.