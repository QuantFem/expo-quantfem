# Contributing to QuantFem

Thank you for your interest in contributing to QuantFem! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read it before contributing.

## Development Setup

1. **Fork the Repository**
   - Go to https://github.com/yourusername/quantfem
   - Click the "Fork" button in the top right
   - Clone your fork locally

2. **Set Up Development Environment**
   ```bash
   # Install dependencies
   npm install
   
   # Start development server
   npm start
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-fix-name
   ```

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Component Guidelines

1. **File Structure**
   ```
   components/
   ├── ComponentName/
   │   ├── index.tsx
   │   ├── styles.ts
   │   └── types.ts
   ```

2. **Naming Conventions**
   - Use PascalCase for component names
   - Use camelCase for functions and variables
   - Use UPPER_CASE for constants

3. **Props**
   - Define prop types using TypeScript interfaces
   - Make props required unless they have a default value
   - Document complex props with JSDoc comments

### Theme System

1. **Adding New Themes**
   - Add theme colors to `constants/Colors.ts`
   - Update theme types in `types/theme.ts`
   - Add theme preview in settings

2. **Using Themes**
   - Use theme hooks for accessing theme values
   - Follow the existing color naming conventions
   - Test all themes when making UI changes

### Localization

1. **Adding New Strings**
   - Add strings to `constants/locales/en.ts`
   - Add translations to other language files
   - Use string constants instead of hardcoded text

2. **Adding New Languages**
   - Create new language file in `constants/locales/`
   - Add language option to settings
   - Test all UI elements with new language

### Testing

1. **Unit Tests**
   - Write tests for new components
   - Test edge cases and error conditions
   - Maintain good test coverage
   - Use Jest and React Native Testing Library
   - Test both success and failure scenarios

2. **Integration Tests**
   - Test component interactions
   - Test navigation flows
   - Test data persistence
   - Test platform-specific behaviors
   - Test error handling

3. **Platform-Specific Testing**
   - Test on multiple iOS devices (iPhone 12+)
   - Test on various Android devices (Android 11+)
   - Verify storage operations on both platforms
   - Test form submissions and validation
   - Check calendar interactions
   - Verify notifications

4. **Known Issues to Watch For**
   - iOS Storage Inconsistency
     * SQLite operations may fail on some iOS devices
     * Implement proper error handling
     * Add data validation checks
     * Consider using AsyncStorage as fallback

   - Form Validation
     * Current validation needs enhancement
     * Test all edge cases
     * Add proper error messages
     * Implement input sanitization

   - Performance
     * Monitor app performance on older devices
     * Optimize large lists and data sets
     * Check memory usage
     * Test background operations

5. **Testing Tools**
   - React Native Debugger
   - Flipper for debugging
   - Chrome DevTools
   - Performance Monitor
   - Storage debugging tools

6. **Test Coverage Requirements**
   - Minimum 80% code coverage
   - 100% coverage for critical paths
   - Test all error scenarios
   - Test all user interactions
   - Test data persistence

7. **Manual Testing Checklist**
   - [ ] Test on iOS 15.0+
   - [ ] Test on Android 11+
   - [ ] Verify data persistence
   - [ ] Check form submissions
   - [ ] Test calendar interactions
   - [ ] Verify notifications
   - [ ] Check theme consistency
   - [ ] Test localization
   - [ ] Verify accessibility
   - [ ] Check performance

### Documentation

1. **Code Documentation**
   - Add JSDoc comments for functions
   - Document complex algorithms
   - Update README.md for new features

2. **User Documentation**
   - Update user guide for new features
   - Add screenshots for UI changes
   - Document any new settings

## Pull Request Process

1. **Before Submitting**
   - Run tests: `npm test`
   - Check code style: `npm run lint`
   - Update documentation
   - Test on both iOS and Android

2. **Pull Request Description**
   - Describe the changes
   - Link related issues
   - Add screenshots for UI changes
   - List any breaking changes

3. **Review Process**
   - Address review comments
   - Keep commits focused and atomic
   - Rebase if needed

## Release Process

1. **Version Bumping**
   - Update version in package.json
   - Update version in app.json
   - Create changelog entry

2. **Testing Release**
   - Test on multiple devices
   - Verify all features work
   - Check performance

3. **Deployment**
   - Build for both platforms
   - Test installation process
   - Verify app store requirements

## Getting Help

- Open an issue for bugs
- Use discussions for feature requests
- Join our community chat
- Contact maintainers

## Recognition

Contributors will be recognized in:
- README.md
- Release notes
- Documentation

## License and Usage Rights

By contributing to this project, you agree that your contributions will be licensed under the QuantFem Proprietary License. This means:

1. **Non-Commercial Use Only**
   - Your contributions can be used for non-commercial purposes
   - Commercial use requires explicit permission from QuantFem

2. **Contribution Agreement**
   - You confirm you have the right to submit the contributions
   - You grant QuantFem the right to use your contributions
   - You understand your code may be used in commercial versions

3. **No Guarantee of Commercial Access**
   - Contributing does not grant commercial usage rights
   - Commercial licensing must be arranged separately

4. **Attribution**
   - Your contributions will be credited in the project
   - You may be listed in project documentation

Thank you for contributing to QuantFem! 