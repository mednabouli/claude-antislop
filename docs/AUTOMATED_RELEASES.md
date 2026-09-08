# Automated Releases

Claude Anti-Slop uses semantic-release for automated versioning and publishing.

## How It Works

1. **Commit messages** follow Conventional Commits format
2. **GitHub Actions** runs tests on every push
3. **Semantic-release** analyzes commits and determines version bump
4. **Auto-publish** to npm and GitHub Releases

## Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat:` - New feature (triggers minor version bump)
- `fix:` - Bug fix (triggers patch version bump)
- `docs:` - Documentation only (no version bump)
- `chore:` - Maintenance (no version bump)
- `refactor:` - Code refactor (no version bump)
- `test:` - Tests only (no version bump)
- `perf:` - Performance improvement (triggers patch version bump)
- `BREAKING CHANGE:` - Breaking change (triggers major version bump)

### Examples

```bash
# Feature (0.1.0 → 0.2.0)
git commit -m "feat: add watch mode"

# Bug fix (0.1.0 → 0.1.1)
git commit -m "fix: handle missing memory directory"

# Breaking change (0.1.0 → 1.0.0)
git commit -m "feat: change memory API

BREAKING CHANGE: memory-search now requires --query"

# Documentation (no version bump)
git commit -m "docs: add troubleshooting guide"
```

## Manual Release

```bash
# Dry run (test release)
npm run release:dry

# Actual release
npm run release
```

## GitHub Secrets Required

- `NPM_TOKEN` - npm publish token
- `GITHUB_TOKEN` - Auto-created by GitHub Actions

## Workflow Files

- `.github/workflows/release.yml` - Tag-based releases
- `.github/workflows/semantic-release.yml` - Auto-releases on main push
- `.github/workflows/ci-multi-os.yml` - Multi-OS testing

## Version Tags

Releases are tagged as:
- `v0.1.0` - Initial release
- `v0.1.1` - Patch (bug fixes)
- `v0.2.0` - Minor (new features)
- `v1.0.0` - Major (breaking changes)

## npm Publishing

Package is published to:
- **Registry:** https://www.npmjs.com/package/claude-antislop
- **Access:** Public
- **Tag:** latest

## GitHub Releases

Releases created at:
- https://github.com/mednabouli/claude-antislop/releases

Includes:
- Release notes (auto-generated)
- Changelog
- Assets (package.json, README)

## Troubleshooting

### Release not triggered

Check commit message format:
```bash
git log --oneline
```

### Tests failing

Fix tests before release:
```bash
npm test
```

### npm publish fails

Check NPM_TOKEN secret:
```bash
# In GitHub repo settings > Secrets > Actions
# Add NPM_TOKEN with value from: npm access token create
```

## See Also

- [Semantic Release](https://semantic-release.gitbook.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [npm Publishing](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
