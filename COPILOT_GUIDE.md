# GitHub Copilot Agent Configuration for Astralx

This document describes how to use GitHub Copilot effectively with the Astralx project.

## Project Context

Astralx is a monorepo built with:

- **Nx Workspace** for monorepo management
- **NestJS** for the API backend
- **React Native** for the mobile app
- **TypeScript** throughout
- **OpenAPI/Swagger** for API documentation

## Scaffolding with Copilot

### Generate NestJS Modules

When you need a new API module:

**Prompt:**

```
Generate a NestJS module for [feature] with:
- Controller with CRUD endpoints
- Service with business logic
- DTOs for request/response
- OpenAPI decorators for documentation
```

**Example Output:**

```typescript
// users.controller.ts
@ApiTags('users')
@Controller('users')
export class UsersController {
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async findAll(): Promise<User[]> { ... }
}
```

### Generate React Native Components

For mobile UI components:

**Prompt:**

```
Generate a React Native component for [feature] with:
- TypeScript interface for props
- Responsive styling
- React Navigation integration (if needed)
```

### Generate TypeScript Client from OpenAPI

After adding API endpoints:

```bash
# 1. Start the API
npm run start:api

# 2. Generate client
npm run generate:api-client

# 3. Use in mobile app
import { DefaultApi } from './api-client';
```

## Code Generation Patterns

### API Endpoint Pattern

```typescript
@Controller('resource')
export class ResourceController {
  constructor(private readonly service: ResourceService) {}

  @Post()
  @ApiOperation({ summary: 'Create resource' })
  @ApiResponse({ status: 201, type: ResourceDto })
  async create(@Body() dto: CreateResourceDto): Promise<ResourceDto> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all resources' })
  async findAll(): Promise<ResourceDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get resource by ID' })
  async findOne(@Param('id') id: string): Promise<ResourceDto> {
    return this.service.findOne(id);
  }
}
```

### Mobile Screen Pattern

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ScreenNameProps {
  navigation: any;
  route: any;
}

export const ScreenName: React.FC<ScreenNameProps> = ({
  navigation,
  route,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Screen Title</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
```

### DTO Pattern

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
```

## Testing with Copilot

### Generate Unit Tests

**Prompt:**

```
Generate unit tests for [service/component] covering:
- Happy path scenarios
- Error cases
- Edge cases
```

### Test Pattern for NestJS

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const result = await service.create({ email: 'test@example.com' });
    expect(result).toBeDefined();
    expect(result.email).toBe('test@example.com');
  });
});
```

## Database Integration

When working with databases:

**Prompt:**

```
Generate a TypeORM entity for [model] with:
- Primary key (UUID)
- Timestamps (createdAt, updatedAt)
- Relationships to [other models]
- Proper indexes
```

## Common Copilot Prompts

### For API Development

1. "Create a NestJS service for user authentication with JWT"
2. "Generate OpenAPI documentation for this endpoint"
3. "Add validation decorators to this DTO"
4. "Create a database migration for this entity"

### For Mobile Development

1. "Create a React Native form component with validation"
2. "Generate a custom hook for API calls with loading states"
3. "Create a responsive layout for this screen"
4. "Add navigation between these screens"

### For Infrastructure

1. "Create a Dockerfile for production deployment"
2. "Generate Kubernetes manifests for this service"
3. "Create environment variables configuration"
4. "Add health check endpoints"

## Best Practices

1. **Be Specific:** Provide context about the project structure
2. **Incremental:** Generate code in small, testable chunks
3. **Review:** Always review and test generated code
4. **Refactor:** Use Copilot to help refactor existing code
5. **Documentation:** Ask Copilot to add JSDoc comments

## Nx Commands Reference

```bash
# Generate new module
npx nx g @nx/nest:resource [name] --project=api

# Generate component
npx nx g @nx/react-native:component [name] --project=mobile

# Generate library
npx nx g @nx/js:lib [name]

# Run commands
npx nx serve [project]
npx nx build [project]
npx nx test [project]
npx nx lint [project]
```

## Troubleshooting Copilot Suggestions

If Copilot suggestions don't match the project:

1. Check if you're in the correct file/directory
2. Provide more context in comments
3. Show examples from existing code
4. Be explicit about imports and dependencies

## Examples of Good Prompts

### Bad Prompt

```
Create a user API
```

### Good Prompt

```
Create a NestJS controller for user management in apps/api/src/app/users/ with:
- GET /api/users (list all)
- GET /api/users/:id (get by ID)
- POST /api/users (create)
- PUT /api/users/:id (update)
- DELETE /api/users/:id (delete)
Include OpenAPI decorators and use the existing app.service.ts as reference.
```

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Native Documentation](https://reactnative.dev/)
- [Nx Documentation](https://nx.dev/)
- [OpenAPI Specification](https://swagger.io/specification/)
