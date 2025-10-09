# Contributing to Universal FHEVM SDK

Thank you for your interest in contributing to the Universal FHEVM SDK! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue on GitHub with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, framework)
- Code snippets or screenshots if applicable

### Suggesting Features

We welcome feature suggestions! Please create an issue with:
- Clear description of the feature
- Use case and benefits
- Proposed implementation (if you have ideas)
- Examples of how it would be used

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/fhevm/universal-sdk.git
   cd universal-sdk
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation
   - Ensure all tests pass

4. **Commit your changes**
   ```bash
   git commit -m "Add feature: description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Describe your changes
   - Reference any related issues
   - Include screenshots for UI changes

## Development Setup

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, or pnpm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/fhevm/universal-sdk.git
cd universal-sdk

# Install dependencies
npm install

# Build the SDK
cd packages/fhevm-sdk
npm run build

# Run tests
npm test
```

### Running Examples

```bash
# Navigate to an example
cd examples/rideshare

# Install dependencies
npm install

# Start development server
npm run dev
```

## Code Style

### TypeScript
- Use TypeScript for all new code
- Enable strict mode
- Provide type annotations
- Avoid `any` types when possible

### Formatting
- We use Prettier for code formatting
- Run `npm run format` before committing
- 2 spaces for indentation
- Single quotes for strings
- Semicolons required

### Linting
- We use ESLint for linting
- Run `npm run lint` before committing
- Fix all warnings and errors

### Naming Conventions
- **Files**: camelCase for regular files, PascalCase for components
- **Variables/Functions**: camelCase
- **Classes/Interfaces**: PascalCase
- **Constants**: UPPER_SNAKE_CASE
- **Types**: PascalCase with descriptive names

## Testing

### Writing Tests
- Write tests for all new features
- Maintain or improve code coverage
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure
```typescript
describe('FHEVMClient', () => {
  describe('encrypt', () => {
    it('should encrypt a number to euint32', async () => {
      // Arrange
      const client = new FHEVMClient({ network: 'localhost' })

      // Act
      const encrypted = await client.encrypt(42, 'euint32')

      // Assert
      expect(encrypted.handles).toBeInstanceOf(Uint8Array)
    })
  })
})
```

## Documentation

### Updating Documentation
- Update README.md for major features
- Add API documentation to docs/API_REFERENCE.md
- Include code examples
- Update CHANGELOG.md

### Documentation Style
- Clear and concise
- Include code examples
- Use proper markdown formatting
- Add table of contents for long documents

## Commit Messages

Follow the Conventional Commits specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(core): add support for euint256 encryption
fix(react): resolve hook dependency warning
docs(api): update encryption examples
test(client): add integration tests for decryption
```

## Release Process

We use semantic versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

Maintainers will handle releases.

## Code Review

All submissions require code review. Reviewers will check for:
- Code quality and style
- Test coverage
- Documentation
- Performance implications
- Security considerations

## Community Guidelines

### Be Respectful
- Treat everyone with respect
- Welcome newcomers
- Be patient with questions
- Provide constructive feedback

### Be Collaborative
- Share knowledge
- Help others learn
- Review pull requests
- Participate in discussions

### Be Professional
- Keep discussions on-topic
- Avoid personal attacks
- Focus on the code, not the person
- Follow the Code of Conduct

## Questions?

If you have questions:
- Check the [documentation](./docs)
- Search existing issues
- Join our [Discord community](https://discord.gg/zama)
- Create a new issue

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the Universal FHEVM SDK! 🚀
