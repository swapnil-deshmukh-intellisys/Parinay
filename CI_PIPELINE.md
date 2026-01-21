# GitHub Actions CI Pipeline

## Overview

This repository includes a GitHub Actions CI pipeline that automatically runs quality checks on every push to `main` and on all pull requests targeting `main`.

## Pipeline Configuration

**Location**: `.github/workflows/ci.yml`

## Triggers

The CI pipeline runs automatically when:
- ✅ Code is **pushed** to the `main` branch
- ✅ A **pull request** is opened or updated targeting `main`

## Pipeline Execution Order

The pipeline executes **root-level commands** in this exact order:

### 1. **Lint** (`npm run lint`)
   - Runs ESLint on backend code
   - Runs Angular linting on frontend code
   - **Fails** if any linting errors are found

### 2. **Test** (`npm test`)
   - Runs backend tests (Jest)
   - Runs frontend tests (Karma/Jasmine)
   - **Fails** if any test fails

### 3. **Test Coverage** (`npm run test:coverage`)
   - Generates backend coverage reports
   - Generates frontend coverage reports
   - **Fails** if coverage generation fails

## Failure Behavior

**The pipeline will fail if any step fails**, and subsequent steps will be skipped (except artifact uploads).

## Setup Steps (Before Main Execution)

1. **Checkout code** - Downloads repository code
2. **Setup Node.js 18.x** - Configures Node.js environment
3. **Install dependencies**:
   - Root dependencies (`npm install`)
   - Backend dependencies (`cd backend && npm install`)
   - Frontend dependencies (`cd parinay && npm install`)
4. **Install Playwright browsers** (optional, won't fail pipeline)

## Artifacts

### Coverage Reports
- **Uploaded**: After every run (success or failure)
- **Location**: 
  - `backend/coverage/`
  - `parinay/coverage/`
- **Retention**: 30 days

### Test Results
- **Uploaded**: Only on failure
- **Location**: Test files for debugging
- **Retention**: 7 days

## Viewing Results

### In GitHub
1. Navigate to your repository on GitHub
2. Click the **"Actions"** tab
3. Select the workflow run you want to view
4. Expand each step to see detailed logs

### Download Artifacts
1. Go to the workflow run page
2. Scroll to the **"Artifacts"** section at the bottom
3. Download `coverage-reports` to view coverage data
4. Extract and open `index.html` files in a browser

## Local Testing

Before pushing, test the CI commands locally:

```bash
# Test all commands in order
npm run lint        # Step 1
npm test            # Step 2
npm run test:coverage  # Step 3
```

Or test everything at once:

```bash
npm run lint && npm test && npm run test:coverage
```

## Troubleshooting

### Pipeline Fails on Lint
**Fix locally:**
```bash
npm run lint:fix
```

**Common issues:**
- ESLint configuration errors
- TypeScript compilation errors
- Missing dependencies

### Pipeline Fails on Tests
**Debug locally:**
```bash
npm test
```

**Common issues:**
- Test failures
- Missing test dependencies
- Environment variable issues

### Pipeline Fails on Coverage
**Debug locally:**
```bash
npm run test:coverage
```

**Common issues:**
- Coverage thresholds not met
- Coverage configuration errors
- Missing coverage reporters

### Dependencies Not Installing
**Solutions:**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall
- Check `package.json` syntax
- Verify Node.js version compatibility

## CI Status Badge

Add this to your README.md to show CI status:

```markdown
![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI%20Pipeline/badge.svg)
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repository name.

## Customization

### Change Node.js Version

Edit `.github/workflows/ci.yml`:

```yaml
matrix:
  node-version: [18.x, 20.x]  # Test on multiple versions
```

### Add Environment Variables

1. Go to Repository Settings → Secrets and variables → Actions
2. Add secrets or variables
3. Reference in workflow:

```yaml
- name: Use secret
  run: echo ${{ secrets.MY_SECRET }}
```

### Skip CI for Specific Commits

Include `[skip ci]` in your commit message:

```bash
git commit -m "docs: update README [skip ci]"
```

## Performance

- **Caching**: npm dependencies are cached for faster builds
- **Parallel Execution**: Tests run in parallel where possible
- **Typical Duration**: 5-10 minutes depending on test count

## Support

For issues with the CI pipeline:
1. ✅ Check workflow logs in GitHub Actions
2. ✅ Test commands locally first
3. ✅ Review this documentation
4. ✅ Check `.github/workflows/ci.yml` configuration

## Pipeline Summary

```
┌─────────────────┐
│   Push/PR       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Setup Node.js  │
│  Install Deps   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  1. npm lint    │ ◄─── Fails if errors
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  2. npm test    │ ◄─── Fails if tests fail
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 3. test:coverage│ ◄─── Fails if coverage fails
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Upload Artifacts│
└─────────────────┘
```
