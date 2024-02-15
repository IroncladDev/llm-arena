# AI to AI

An open-source platform for comparing LLMs

[🔗 ai-to.ai](https://ai-to.ai)

## Development

Install dependencies and start the development environment.

1. Ensure you have [Bun](https://bun.sh), [Docker](https://docker.com), and [Mprocs](https://github.com/pvolok/mprocs) installed
2. Fill out the environment variables in `.env.example` and rename it to `.env`. You will need to create a separate [Github oath app](https://github.com/settings/developers) for local development and production.
3. Run `mprocs` to start the development environment. This will install dependencies and spin up a postgres docker instance & database admin
4. Run `bun prisma migrate deploy` apply pending database migrations
5. Run `bun prisma generate` to generate the Prisma client types
6. Run `bun db:seed` to seed the database with initial data. If this fails, try running `bun db:reset` and then `bun db:seed`

## Database

Seed, reset, and apply pending migrations to the database.

### Apply pending migrations

Applies pending migrations to the database.

```bash
bun prisma migrate deploy
```

### Seed the database

Seeds the database with initial data.

```bash
bun db:seed
```

### Reset/Wipe the database

Resets the database and applies all pending migrations.

```bash
bun db:reset
```

See the [Prisma Documentation](https://www.prisma.io/docs/orm/tools/prisma-cli) for more information on how to control the database.

## Deploying to Production

1. Set the environment variables in `.env` or in you hosting provider's environment settings.
2. Run `bun run build` to create a production build
3. Run `bun run start` to start the production server

## Todo

- Comparison Page
  - Exporting
- Landing Page
- Contributor Docs
- Login = contribute
- Responsive
  - Find LLMs (small screen) without opening sidebar
- Color theme?

## Aftermath / Considering

- Better email templates
- Notify contributors of suspensions/model removals
