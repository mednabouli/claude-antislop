# JSON Output Mode

Claude Anti-Slop supports **machine-readable JSON output** for automation, scripting, and integration.

## Enable JSON Mode

Add `--json` to any command:

```bash
claude-antislop status --json
claude-antislop memory-search --query "error handling" --json
claude-antislop scan --repo ./my-project --json
```

## Output Format

```typescript
interface Response {
  success: boolean;
  message: string;
  data: any | null;
  hint?: string | null;
  timestamp: string;
}
```

## Examples

### Status
```json
{
  "success": true,
  "message": "Plugin active",
  "data": {"active": true, "version": "0.1.0"},
  "hint": null,
  "timestamp": "2026-09-07T21:05:00.000Z"
}
```

### Memory Search
```json
{
  "success": true,
  "message": "Found 3 results",
  "data": {
    "query": "testing",
    "results": [{"file": "standards/testing.md", "score": 0.92}],
    "count": 3
  },
  "timestamp": "2026-09-07T21:05:00.000Z"
}
```

## Scripting

### Bash
```bash
status=$(claude-antislop status --json)
active=$(echo "$status" | jq -r '.data.active')
```

### Node.js
```javascript
import { execSync } from 'child_process';
const status = JSON.parse(execSync('claude-antislop status --json'));
```

## Quiet Mode

```bash
claude-antislop status --quiet
echo $?  # 0 = success, 1 = failure
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Error |
