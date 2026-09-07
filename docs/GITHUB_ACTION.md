# GitHub Action

Claude Anti-Slop includes a GitHub Action workflow for automated quality checks on every push and pull request.

## Workflow Features

- Installs and initializes claude-antislop
- Runs status check
- Scans repository and generates templates
- Runs code quality checks on TypeScript files
- Searches memory for patterns
- Uploads JSON results as artifacts
- Comments PR with formatted results

## Usage

The workflow runs automatically on:

- Push to `main` branch
- Pull requests targeting `main` branch

## Artifacts

Two artifacts are uploaded after each run:

- `claude-antislop-scan` - Scan results (scan.json)
- `claude-antislop-quality` - Quality and memory results (quality.json, memory.json)

Artifacts are retained for 7 days.

## PR Comments

On pull requests, the workflow posts a comment with:

- Overall status (pass/fail)
- Templates generated count
- Quality check results
- Memory patterns found
- Top 3 pattern matches

## Customization

### Change Trigger Branches

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
```

### Add Memory Learning

```yaml
- name: Learn from Git history
  run: claude-antislop learn-from-git --recent 30d --json > learning.json
```

### Fail on Quality Issues

```yaml
- name: Fail on quality issues
  run: |
    if ! jq -e '.success' quality.json > /dev/null; then
      echo "Quality check failed"
      exit 1
    fi
```

### Matrix Testing

```yaml
strategy:
  matrix:
    node-version: [18, 20, 22]
    os: [ubuntu-latest, macos-latest, windows-latest]

runs-on: ${{ matrix.os }}
steps:
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ matrix.node-version }}
```

## Local Testing

Test the workflow locally with [act](https://github.com/nektos/act):

```bash
brew install act
act pull_request
```

## See Also

- [JSON Output Mode](JSON_OUTPUT.md)
- [CLI Reference](CLI.md)
- [Automation Guide](AUTOMATION.md)
