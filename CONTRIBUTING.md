# Contributing to HomeBite

Thank you for your interest in contributing to HomeBite! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and constructive
- Provide helpful feedback
- Report issues responsibly
- Maintain professional communication

## Getting Started

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/YOUR-USERNAME/HomeBite.git`
3. **Create a feature branch**: `git checkout -b feature/your-feature-name`
4. **Make your changes**
5. **Push to your fork**: `git push origin feature/your-feature-name`
6. **Create a Pull Request**

## Development Setup

### Backend Setup
```bash
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Code Style Guidelines

### Python (Backend)
- Follow PEP 8
- Use meaningful variable and function names
- Add docstrings to functions and classes
- Write unit tests for new features

### JavaScript/React (Frontend)
- Use functional components with hooks
- Follow ES6+ conventions
- Use meaningful component names (PascalCase)
- Add comments for complex logic
- Use proper prop validation

## Commit Messages

Write clear, descriptive commit messages:
- Use imperative mood ("Add feature" not "Added feature")
- Limit to 72 characters
- Reference issues when applicable: "Fix #123: Description"

## Pull Request Process

1. Update documentation as needed
2. Add/update tests for your changes
3. Ensure all tests pass
4. Provide a clear description of changes
5. Link related issues
6. Be responsive to review feedback

## Reporting Issues

Include:
- Clear title and description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Environment details (OS, Python version, Node version)

## Testing

### Run Backend Tests
```bash
python manage.py test
```

### Run Frontend Tests
```bash
cd frontend
npm run test
```

## Documentation

- Update README.md for user-facing changes
- Update DEPLOYMENT.md for deployment-related changes
- Add docstrings to new functions
- Include inline comments for complex logic

## Areas Needing Contribution

- API documentation
- Frontend UI improvements
- Performance optimization
- Bug fixes
- Test coverage
- Documentation improvements

## Questions?

Open an issue with the "question" label or contact the development team.

---

Thank you for contributing to HomeBite! 🙏
