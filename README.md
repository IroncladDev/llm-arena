# AI to AI

An open-source platform for comparing LLMs

[🔗 ai-to.ai](https://ai-to.ai)

## Development

Install dependencies and start the development environment.

1. Ensure you have [Bun](https://bun.sh), [Docker](https://docker.com), and [Mprocs](https://github.com/pvolok/mprocs) installed
2. Fill out the environment variables in `.env.example` and rename it to `.env`.
   - Create a separate [Github oauth app](https://github.com/settings/developers)
   - Set the redirect URI to `http://localhost:3000/api/auth/callback/github`
   - You will need a sendgrid API key if you want to send emails
3. Run `mprocs` to start the development environment. This will install dependencies, spin up a postgres docker instance, and prisma studio.
4. Run `bun db:sync` to apply pending migrations and create the prisma client
5. Run `bun db:seed` to seed the database with initial data

See the [Prisma Documentation](https://www.prisma.io/docs/orm/tools/prisma-cli) on how to apply migrations and further manipulate the database.

## Deploying to Production

1. Set the environment variables in `.env` or in you hosting provider's environment variable settings.
2. Run `bun run build` to create a production build
3. Run `bun run start` to start the production server
