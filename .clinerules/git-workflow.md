## Brief overview
Guidelines for Git workflow and commit practices specific to this project, emphasizing proper linting and code quality checks.
Breaking the rules is not allowed. If you are unable to follow the rules, ask for permission.

## Git commit practices
- Never use `--no-verify` flag when committing code
- All commits must pass pre-commit hooks including linting, formatting, and type checking
- Fix ESLint errors before attempting to commit rather than bypassing checks
- Use descriptive commit messages with proper formatting

## Code quality enforcement
- Respect all configured linters and formatters (ESLint, Prettier, TypeScript)
- Fix unused variables by prefixing with underscore (e.g., `_error` instead of `error`) for ESLint compliance
- Ensure all code passes TypeScript type checking before committing
- Address all linting issues properly rather than suppressing them

## Development workflow
- Install dependencies properly before running formatters or linters
- Run formatters (Prettier) and linters (ESLint) in the correct project directories
- Wait for all pre-commit hooks to complete successfully
- If commits fail due to linting, fix the issues and retry the commit

## Error handling in tests
- Use underscore prefix for intentionally unused variables in catch blocks
- Remove unused variables or mark them as intentionally unused
- Ensure all test files pass linting requirements before committing
