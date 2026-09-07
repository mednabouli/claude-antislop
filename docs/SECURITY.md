# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

**DO NOT** create a public GitHub issue for security vulnerabilities.

Email: **security@mednabouli.me**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial assessment**: Within 5 business days
- **Resolution plan**: Within 10 business days
- **Public disclosure**: Coordinated with reporter

## Security Best Practices

### Local-First Design
- All data stays on your machine
- No telemetry or analytics
- No cloud synchronization
- Per-developer memory isolation

### Safe Defaults
- Memory directory: `~/.claude-antislop/memory/`
- Temp files: Auto-cleaned after operations
- No repository modifications
- No automatic updates

### Input Validation
- Category validation (whitelist only)
- Filename sanitization
- Path traversal prevention
- Command injection protection

## Security Audit Checklist

- [x] No hardcoded secrets
- [x] No external API calls
- [x] No network requests (except MCP stdio)
- [x] Input validation on all user inputs
- [x] Path traversal prevention
- [x] Command injection prevention
- [x] Temp file cleanup
- [x] No eval() or Function constructor
- [x] Dependencies audited regularly

## Contact

- **Security Email**: security@mednabouli.me
- **GitHub**: @mednabouli
- **Website**: mednabouli.me

## License

This security policy is part of the MIT-licensed Claude Anti-Slop project.
