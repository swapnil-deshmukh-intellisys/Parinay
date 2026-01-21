# GitHub Actions CI/CD Pipeline

## Overview

This repository uses GitHub Actions for Continuous Integration (CI). The CI pipeline automatically runs on every push to `main` and on all pull requests targeting `main`.

## Pipeline Steps

The CI pipeline executes the following steps **in order**:

1. **Lint** - Run linting on both backend and frontend code
2. **Test** - Run all tests (backend + frontend)
3. **Test Coverage** - Generate and verify test coverage reports

## Workflow File

The CI pipeline is defined in: `.github/workflows/ci.yml`

## Triggers

The pipeline runs automatically when:
- Code is pushed to the `main` branch
- A pull request is opened or updated targeting `main`

## Pipeline Steps Breakdown

### 1. Setup
- Checks out the repository code
- Sets up Node.js 18.x
- Caches npm dependencies for faster builds

### 2. Dependencies
- Installs root-level dependencies
- Installs backend dependencies (`backend/`)
- Installs frontend dependencies (`parinay/`)
- Installs Playwright browsers (for E2E tests, optional)

### 3. Execution (Root-Level Commands)
The pipeline executes these root-level npm scripts **in order**:

```bash
# Step 1: Linting
npm run lint

# Step 2: Testing
npm test

# Step 3: Coverage
npm run test:coverage
```

### 4. Artifacts
- **Coverage Reports**: Uploaded after every run (success or failure)
  - Backend coverage: `backend/coverage/`
  - Frontend coverage: `parinay/coverage/`
- **Test Results**: Uploaded only on failure for debugging

## Failure Behavior

The pipeline **fails** if any of the following occur:
- Linting finds errors
- Any test fails
- Coverage generation fails
- Any step returns a non-zero exit code

When a step fails, **all subsequent steps are skipped** (except artifact uploads).

## Viewing Results

### In GitHub
1. Go to the "Actions" tab in your GitHub repository
2. Click on the workflow run to see detailed logs
3. View individual step outputs by expanding each step

### Coverage Reports
Coverage reports are available as downloadable artifacts:
1. Go to the workflow run
2. Scroll to "Artifacts" section
3. Download `coverage-reports` zip file
4. Extract and open `index.html` files in a browser

## Local Testing

You can test the CI pipeline locally using [act](https://github.com/nektos/act):

```bash
# Install act
npm install -g act

# Run the CI workflow locally
act pull_request
```

Or run the commands manually:

```bash
npm run lint
npm test
npm run test:coverage
```

## Customization

### Node.js Version
To change the Node.js version, edit `.github/workflows/ci.yml`:

```yaml
matrix:
  node-version: [18.x, 20.x]  # Test on multiple versions
```

### Adding Steps
Add new steps before the lint step:

```yaml
- name: Your custom step
  run: your-command
```

### Skipping CI
To skip CI for a specific commit, include `[skip ci]` in your commit message:

```bash
git commit -m "docs: update README [skip ci]"
```

## Troubleshooting

### Pipeline Fails on Lint
- Fix linting errors locally: `npm run lint:fix`
- Check `.eslintrc.json` configuration
- Review lint output in GitHub Actions logs

### Pipeline Fails on Tests
- Run tests locally: `npm test`
- Check test output in GitHub Actions logs
- Verify all dependencies are installed correctly

### Pipeline Fails on Coverage
- Run coverage locally: `npm run test:coverage`
- Ensure coverage thresholds are met
- Check coverage configuration in `jest.config.js` and `karma.conf.js`

### Dependencies Issues
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall
- Verify `package.json` files are correct

## Environment Variables

If you need environment variables for the CI, add them in GitHub:
1. Repository Settings → Secrets and variables → Actions
2. Add new repository secrets or variables
3. Reference in workflow: `${{ secrets.YOUR_SECRET }}`

## Matrix Builds

The pipeline currently runs on Ubuntu with Node.js 18.x. To add more platforms:

```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x]
    os: [ubuntu-latest, windows-latest, macos-latest]
```

## Performance

- **Caching**: npm dependencies are cached for faster builds
- **Parallel Jobs**: Tests run in parallel where possible
- **Artifact Retention**: Coverage reports kept for 30 days

## Support

For issues with the CI pipeline:
1. Check the workflow logs in GitHub Actions
2. Review this README
3. Test commands locally first
4. Open an issue if problems persist
