# Examples

This directory contains example configurations and projects demonstrating how to use Claude AntiSlop in different scenarios.

## Contents

### Configurations

- **[strict/](strict/.antisloprc.json)** – Maximum strictness for production codebases
  - All rules enabled as errors
  - Zero tolerance for warnings
  - Best for: Libraries, SDKs, critical infrastructure

- **[relaxed/](relaxed/.antisloprc.json)** – Minimal rules for rapid prototyping
  - Only critical errors enabled
  - Warnings allowed up to threshold
  - Best for: MVPs, prototypes, personal projects

- **[team/](team/.antisloprc.json)** – Balanced configuration for teams
  - Mix of errors and warnings
  - JSON output for CI integration
  - Localization and security enabled
  - Best for: Startups, enterprise teams, collaborative projects

### Example Projects

- **[nextjs-app/](nextjs-app/)** – Next.js application with AntiSlop integration
- **[express-api/](express-api/)** – Express.js API with CI/CD setup
- **[monorepo/](monorepo/)** – pnpm workspace with per-package configs

## Usage

Copy the configuration that matches your needs:

```bash
# For strict production setup
cp examples/strict/.antisloprc.json .antisloprc.json

# For rapid prototyping
cp examples/relaxed/.antisloprc.json .antisloprc.json

# For team collaboration
cp examples/team/.antisloprc.json .antisloprc.json
```

Then customize the rules and patterns to fit your project.

## See Also

- [RECIPES.md](../RECIPES.md) – Common workflows and integration patterns
- [docs/USAGE.md](../docs/USAGE.md) – Configuration guide
- [ARCHITECTURE.md](../ARCHITECTURE.md) – Technical deep dive
