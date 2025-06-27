# CI/CD Pipeline Documentation

This document describes the comprehensive CI/CD pipeline setup for the SPPD-OT (Spanish Public Procurement Data - Open Tenders) project.

## 🚀 Overview

The project uses GitHub Actions to automate testing, validation, and deployment processes. The pipeline ensures code quality, data integrity, and reliable deployments.

## 📋 Pipeline Components

### 1. CI Pipeline (`.github/workflows/ci.yml`)

Runs on every push and pull request to validate code quality and functionality.

#### Jobs Included:

- **HTML Validation**: Validates HTML syntax and structure
- **CSS Validation**: Checks CSS syntax and best practices
- **JavaScript Linting**: Ensures JavaScript code quality
- **JSON Validation**: Validates data file structure
- **Security Scanning**: Checks for security vulnerabilities
- **File Size Check**: Ensures files don't exceed size limits
- **Data Integrity Check**: Validates data structure and content
- **Basic Browser Test**: Tests website functionality in browsers

### 2. Deployment Pipeline (`.github/workflows/deploy.yml`)

Automatically deploys to GitHub Pages when changes are pushed to the main branch.

#### Features:
- Automatic deployment to GitHub Pages
- Post-deployment testing
- Deployment status notifications

## 🛠️ Local Development

### Prerequisites

- Node.js 18+ 
- npm 8+
- Python 3.6+

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run validation checks locally**:
   ```bash
   # Run all linting
   npm run lint
   
   # Run specific checks
   npm run lint:js      # JavaScript linting
   npm run lint:css     # CSS linting
   npm run lint:html    # HTML validation
   
   # Validate data
   npm run validate:json
   npm run validate:data
   ```

3. **Start local development server**:
   ```bash
   npm run serve
   ```

## 📊 Validation Checks

### HTML Validation
- Validates HTML5 syntax
- Checks for accessibility issues
- Ensures proper document structure

### CSS Validation
- Validates CSS syntax
- Checks for best practices
- Ensures responsive design patterns

### JavaScript Linting
- ESLint configuration for browser environment
- Checks for common errors and warnings
- Enforces coding standards

### Data Validation
- Validates JSON structure
- Checks required fields
- Validates data types and formats
- Ensures data integrity

### Security Scanning
- Checks for hardcoded secrets
- Identifies dangerous JavaScript patterns
- Validates external dependencies

## 🔧 Configuration Files

### ESLint Configuration (`.eslintrc.json`)
```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "off"
  }
}
```

### Stylelint Configuration (`.stylelintrc.json`)
```json
{
  "extends": "stylelint-config-standard",
  "rules": {
    "no-descending-specificity": null,
    "max-nesting-depth": 3
  }
}
```

### Package.json Scripts
```json
{
  "scripts": {
    "lint:js": "eslint js/*.js",
    "lint:css": "stylelint css/*.css",
    "lint:html": "html-validate *.html",
    "validate:json": "python3 -m json.tool data/open_tenders.json",
    "validate:data": "node scripts/validate-data.js"
  }
}
```

## 🚀 Deployment Process

### Automatic Deployment
1. Push changes to `main` branch
2. CI pipeline runs validation checks
3. If all checks pass, deployment pipeline starts
4. Website is deployed to GitHub Pages
5. Post-deployment tests verify functionality

### Manual Deployment
```bash
# Trigger deployment manually
gh workflow run deploy.yml
```

## 📈 Monitoring and Notifications

### GitHub Actions Dashboard
- View pipeline status at: `https://github.com/[username]/sppd-ot/actions`
- Monitor individual job results
- Download artifacts (Lighthouse reports, etc.)

### Notifications
- Pull request comments with validation results
- Deployment status updates
- Error notifications for failed checks

## 🔍 Troubleshooting

### Common Issues

1. **HTML Validation Fails**
   - Check for unclosed tags
   - Verify HTML5 compliance
   - Ensure proper document structure

2. **CSS Validation Fails**
   - Check for syntax errors
   - Verify vendor prefixes
   - Ensure proper selector usage

3. **JavaScript Linting Fails**
   - Fix ESLint warnings/errors
   - Check for undefined variables
   - Verify browser compatibility

4. **Data Validation Fails**
   - Check JSON syntax
   - Verify required fields
   - Ensure proper data types

5. **Deployment Fails**
   - Check GitHub Pages settings
   - Verify repository permissions
   - Review deployment logs

### Debugging Commands

```bash
# Run specific validation
npm run validate:data

# Check file sizes
ls -lh *.html css/*.css js/*.js

# Test local server
python3 -m http.server 8000
```

## 📝 Best Practices

### Code Quality
- Run validation checks before committing
- Follow established coding standards
- Test changes locally before pushing

### Data Management
- Validate data structure before updates
- Maintain data integrity
- Document data schema changes

### Deployment
- Test in staging environment first
- Monitor post-deployment checks
- Keep deployment logs for debugging

## 🔄 Workflow Triggers

### CI Pipeline
- **Push**: Any branch
- **Pull Request**: Any branch → main/develop

### Deployment Pipeline
- **Push**: main branch only
- **Manual**: Workflow dispatch

## 📊 Performance Monitoring

### Lighthouse Reports
- Performance scores
- Accessibility metrics
- Best practices compliance
- SEO optimization

### File Size Monitoring
- HTML files: < 500KB
- CSS files: < 1MB
- JavaScript files: < 500KB

## 🛡️ Security

### Automated Checks
- Secret scanning
- Dependency vulnerability scanning
- Code security analysis

### Manual Reviews
- Code review process
- Security checklist
- Access control verification

## 📞 Support

For issues with the CI/CD pipeline:

1. Check GitHub Actions logs
2. Review validation error messages
3. Test locally to reproduce issues
4. Create detailed issue reports

## 🔄 Updates and Maintenance

### Regular Maintenance
- Update dependencies monthly
- Review and update validation rules
- Monitor pipeline performance

### Version Updates
- Node.js version updates
- Tool version updates
- Configuration improvements

---

**Last Updated**: January 2025  
**Pipeline Version**: 1.0.0  
**Maintainer**: SPPD Team 