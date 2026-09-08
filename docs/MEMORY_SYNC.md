# Memory Sync

Memory Sync keeps your Claude Anti-Slop memory backed up and synchronized across machines using Google Drive.

## Quick Start

```bash
# Sync to Google Drive
claude-antislop sync to-drive

# Sync from Google Drive
claude-antislop sync from-drive --path "~/Google Drive/Claude Anti-Slop/sync-2026-09-07T22-00-00-000Z.json"

# List sync backups
claude-antislop sync list

# Enable auto-sync
claude-antislop sync enable-auto

# Disable auto-sync
claude-antislop sync disable-auto
```

## Commands

### Sync to Drive

```bash
# Manual sync
claude-antislop sync to-drive

# Auto sync (from config)
claude-antislop sync to-drive --auto
```

Creates timestamped backup in `~/Google Drive/Claude Anti-Slop/`.

### Sync from Drive

```bash
# Restore from backup
claude-antislop sync from-drive --path "path/to/backup.json"

# Force overwrite
claude-antislop sync from-drive --path "path/to/backup.json" --force
```

Restores memory from Google Drive backup.

### List Backups

```bash
claude-antislop sync list
```

Shows all sync backups with timestamps and sizes.

### Auto-Sync

```bash
# Enable
claude-antislop sync enable-auto

# Disable
claude-antislop sync disable-auto

# Check status
claude-antislop sync status
```

Auto-sync runs on every memory write operation.

## Configuration

Sync settings stored in `~/.claude-antislop/config.json`:

```json
{
  "features": {
    "autoSync": true,
    "syncPath": "/Users/med/Google Drive/Claude Anti-Slop"
  }
}
```

## Google Drive Setup

### Desktop

1. Install [Google Drive for Desktop](https://www.google.com/drive/download/)
2. Sign in with your Google account
3. Drive will appear as `~/Google Drive`

### Manual

1. Create directory: `~/Google Drive/Claude Anti-Slop`
2. Ensure it syncs to cloud

## Multi-Machine Sync

### Machine 1 (Source)
```bash
# Enable auto-sync
claude-antislop sync enable-auto

# Initial sync
claude-antislop sync to-drive
```

### Machine 2 (Target)
```bash
# Wait for Drive to sync
# List available backups
claude-antislop sync list

# Restore latest backup
claude-antislop sync from-drive --path "~/Google Drive/Claude Anti-Slop/sync-latest.json"

# Enable auto-sync
claude-antislop sync enable-auto
```

## Troubleshooting

### Google Drive not found
```bash
# Check Drive installed
ls ~/Google Drive

# Or set custom path
export GOOGLE_DRIVE=~/MyDrive
claude-antislop sync to-drive
```

### Sync conflicts
```bash
# Force restore from specific backup
claude-antislop sync from-drive --path "path/to/backup.json" --force
```

### Auto-sync not working
```bash
# Check status
claude-antislop sync status

# Re-enable
claude-antislop sync disable-auto
claude-antislop sync enable-auto
```

## Best Practices

- Sync before switching machines
- Keep Drive app running
- Check sync status regularly
- Use descriptive backup names
- Test restore periodically

## See Also

- [Backup & Restore](BACKUP.md)
- [Configuration](CONFIGURATION.md)
