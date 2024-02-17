# AI to AI

An open-source platform for comparing LLMs

[🔗 ai-to.ai](https://ai-to.ai)

## Development

Install dependencies and start the development environment.

1. Ensure you have [Bun](https://bun.sh), [Docker](https://docker.com), and [Mprocs](https://github.com/pvolok/mprocs) installed
2. Fill out the environment variables in `.env.example` and rename it to `.env`. You will need to create a separate [Github oath app](https://github.com/settings/developers) for local development and production.
3. Run `mprocs` to start the development environment. This will install dependencies and spin up a postgres docker instance & database admin
4. Run `bun db:seed` to seed the database with initial data. If this fails, try running `bun db:sync` and then `bun db:seed`. You may have to run `bun prisma migrate reset` and then `bun db:sync`.

See the [Prisma Documentation](https://www.prisma.io/docs/orm/tools/prisma-cli) on how to apply migrations and further manipulate the database.

## Deploying to Production

1. Set the environment variables in `.env` or in you hosting provider's environment variable settings.
2. Run `bun run build` to create a production build
3. Run `bun run start` to start the production server

## Unimplemented Features (considering)

- Exporting as images
  - Customizing color theme?
- Better email templates
- Notify contributors of suspensions/model removals
- Change requests (adding/editing/removing an LLM's metadata field)
