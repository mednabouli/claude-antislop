# Benchmark Tests

This directory contains test fixtures for performance benchmarks.

## Structure

```
benchmarks/
├── small-app/         # ~100 files, quick scans
├── medium-app/        # ~1,000 files, realistic app
├── large-monorepo/    # ~10,000 files, enterprise scale
└── README.md          # This file
```

## Generating Fixtures

To generate benchmark fixtures:

```bash
# Generate all fixtures
node scripts/generate-benchmarks.js

# Generate specific fixture
node scripts/generate-benchmarks.js --project medium-app
```

## Running Benchmarks

```bash
# Run all benchmarks
node scripts/benchmark.js

# Run specific benchmark
node scripts/benchmark.js --project medium-app

# Generate report
node scripts/benchmark.js --report
```

## Fixture Specifications

### small-app

- **Files:** 100 TypeScript/JavaScript files
- **Structure:** Flat src/ directory
- **Purpose:** Baseline performance, quick iteration
- **Expected:** <500ms scan time

### medium-app

- **Files:** 1,000 TypeScript/JavaScript files
- **Structure:** Nested directories, multiple modules
- **Purpose:** Realistic application size
- **Expected:** <2s scan time

### large-monorepo

- **Files:** 10,000 TypeScript/JavaScript files
- **Structure:** Multiple packages, deep nesting
- **Purpose:** Enterprise-scale performance
- **Expected:** <15s scan time

## Updating Benchmarks

When making performance-related changes:

1. Run benchmarks before changes: `node scripts/benchmark.js --report`
2. Make your changes
3. Run benchmarks after changes: `node scripts/benchmark.js --report`
4. Compare `benchmark-report.json` files
5. Update [BENCHMARKS.md](../../BENCHMARKS.md) if significant changes

## Performance Budget

All changes must maintain:

- **1k files:** <2s cold start
- **10k files:** <15s cold start
- **Watch mode:** <100ms incremental
- **Memory:** <150MB for 1k files

## Troubleshooting

**Benchmarks failing:**
- Ensure test fixtures are generated
- Check Node.js version (20+)
- Increase memory: `NODE_OPTIONS='--max-old-space-size=1024'`

**Inconsistent results:**
- Close other applications
- Run multiple times and average
- Check CPU thermal throttling

## See Also

- [BENCHMARKS.md](../../BENCHMARKS.md) – Full benchmark documentation
- [ARCHITECTURE.md](../../ARCHITECTURE.md) – Performance optimizations
- [RECIPES.md](../../RECIPES.md) – Performance tuning
