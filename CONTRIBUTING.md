# Contributing to Astralx

Thank you for contributing to Astralx! This guide will help you get started.

## Development Setup

### Prerequisites

- Node.js 20+
- npm 10+
- Docker & Docker Compose
- Git

### Quick Start

```bash
# Clone the repository
git clone https://github.com/GuilleGlad/Astralx.git
cd Astralx

# Automated setup (recommended)
npm run setup:dev

# Or manual setup
npm install
cp .env.example .env
docker-compose up -d
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Follow the existing code style
- Write meaningful commit messages (see Commit Conventions below)
- Add tests for new features
- Update documentation as needed

### 3. Run Quality Checks

```bash
# Lint your code
npm run lint

# Build applications
npm run build:api
npm run build:mobile

# Run tests (when available)
npm test
```

### 4. Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: <type>(<scope>): <description>

# Examples:
git commit -m "feat(api): add user authentication endpoint"
git commit -m "fix(mobile): resolve navigation issue"
git commit -m "docs: update API documentation"
git commit -m "chore(infra): update docker-compose configuration"
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes (dependencies, configs, etc.)

### 5. Push and Create a Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a PR on GitHub using the provided template.

## Code Guidelines

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint rules
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Prefer `const` over `let`, avoid `var`

### NestJS (API)

- Follow NestJS best practices
- Use dependency injection
- Create modular, testable services
- Document endpoints with OpenAPI decorators
- Use DTOs for request/response validation

### React Native (Mobile)

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript interfaces for props
- Follow React Native best practices
- Test on both iOS and Android when possible

## Project Structure

```
Astralx/
├── apps/
│   ├── api/              # NestJS backend
│   │   └── src/
│   │       ├── app/      # Application modules
│   │       └── main.ts   # Entry point
│   └── mobile/           # React Native app
│       └── src/
│           ├── app/      # Components and screens
│           └── main.tsx  # Entry point
├── infra/                # Infrastructure files
│   ├── Dockerfile.api
│   ├── init-db.sql
│   └── setup-dev.sh
└── docker-compose.yml    # Dev environment
```

## Useful Commands

### Development

```bash
# Start API (with hot reload)
npm run start:api

# Start mobile app
npm run start:mobile

# Generate API TypeScript client
npm run generate:api-client
```

### Infrastructure

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f [service-name]

# Stop all services
docker-compose down

# Reset everything (careful!)
docker-compose down -v
```

### Code Quality

```bash
# Lint all projects
npm run lint

# Format code
npx prettier --write .

# Build all apps
npm run build:api
npm run build:mobile
```

## Scaffolding with Nx

### Create a new NestJS module

```bash
npx nx g @nx/nest:resource users --project=api
```

### Create a new React Native component

```bash
npx nx g @nx/react-native:component Button --project=mobile
```

### Create a shared library

```bash
npx nx g @nx/js:lib shared-types
```

## OpenAPI/Swagger

The API automatically generates OpenAPI documentation:

- **Swagger UI:** http://localhost:3000/api/docs
- **JSON spec:** http://localhost:3000/api/docs-json

To generate TypeScript clients for mobile:

```bash
# Ensure API is running first
npm run generate:api-client
```

## Database Migrations

(To be implemented in future sprints)

```bash
# Create migration
npm run migration:create -- AddUserTable

# Run migrations
npm run migration:run
```

## Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run tests for specific project
npx nx test api
npx nx test mobile
```

### E2E Tests

```bash
# Run E2E tests
npx nx e2e api-e2e
```

## Troubleshooting

### Docker Issues

```bash
# Check service status
docker-compose ps

# View service logs
docker-compose logs [service-name]

# Restart a service
docker-compose restart [service-name]

# Remove everything and start fresh
docker-compose down -v
docker-compose up -d
```

### Node Modules Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Git Hooks Issues

If git hooks are not working:

```bash
npx husky install
chmod +x .husky/*
```

## Getting Help

- Check the [README](./README.md) for general information
- Review [infra/README.md](./infra/README.md) for infrastructure details
- Look at existing code for examples
- Create an issue for bugs or questions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
