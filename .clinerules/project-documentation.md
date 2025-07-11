## Brief overview
Guidelines for working with the c4 GenAI Suite project, emphasizing the importance of consulting README.md and other project documentation before making changes or suggestions.

## Project context awareness
- Always read and reference README.md for project architecture understanding
- The c4 GenAI Suite is a modular AI chatbot application with three main components: Frontend (React/TypeScript), Backend (NestJS/TypeScript), and REI-S (Python FastAPI)
- Understand the assistant-extension model where assistants are configured with various extensions for different capabilities
- Recognize the MCP (Model Context Protocol) integration as a key extensibility feature

## Development workflow
- Use `./scripts/docker-dev.sh` instead of manual docker-compose commands to avoid cache issues
- Follow the established development setup described in README.md
- Respect the modular architecture when adding new features
- Consider how new features fit into the assistant-extension paradigm

## Code review and feedback handling
- When addressing code review feedback, implement comprehensive solutions that address all points systematically
- Create proper DTOs for API responses instead of returning raw entities
- Use proper NestJS HTTP exceptions (NotFoundException, BadRequestException) instead of generic Error throws
- Add comprehensive OpenAPI documentation with proper decorators
- Follow established naming conventions (camelCase for TypeScript, proper column naming in database entities)

## Git workflow compliance
- Never use `--no-verify` flag when committing code
- All commits must pass pre-commit hooks including linting, formatting, and type checking
- Fix ESLint errors and TypeScript issues properly rather than bypassing checks
- Use descriptive commit messages following conventional commit format

## Technical standards
- Backend uses NestJS with TypeScript, PostgreSQL database
- Frontend uses React with TypeScript, Mantine UI components
- Follow domain-driven design patterns in backend structure
- Implement proper error handling and validation
- Use proper internationalization (i18n) for user-facing text
- Maintain consistency between German and English language files
