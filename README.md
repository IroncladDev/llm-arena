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

## Contributing

### Adding LLMs

1. Apply as a contributor at https://ai-to.ai/contribute
2. Read the [Contributor Guide](https://github.com/IroncladDev/ai-to-ai/blob/main/docs/contributor-guide.md)
3. Once approved, you can [Submit a new LLM](https://ai-to.ai/submit) and [Vote on pending LLMs](https://ai-to.ai/llms)

### Bugs

1. [Open an issue](https://github.com/IroncladDev/ai-to-ai/issues/new) on the repository
2. Describe the bug and include detailed steps on how to reproduce it
3. Include screenshots or videos if possible

### Feature Requests

1. [Open an issue](https://github.com/IroncladDev/ai-to-ai/issues/new) on the repository
2. Describe the feature and how it would be useful
3. Include a quick sketch or mockup if possible (optional, [excalidraw](https://excalidraw.com/) and [figma](https://figma.com) are great tools for this)

### Pull Requests

1. Fork the repository
2. Push a new branch to your fork with your changes
3. Open a pull request to the `main` branch
4. Describe the changes you've made and include a detailed step-by-step guide on how to test them
5. Include screenshots or videos if possible

Use Common Sense. Unreasonable Pull Requests will be closed.
