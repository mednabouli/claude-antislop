# Team Collaboration Features

## Overview

Claude Antislop enables teams to collaborate on code quality standards, share best practices, and maintain consistent code quality across all projects.

---

## Core Features

### 1. Shared Coding Standards

**What you get:**
- Centralized standards configuration
- Team-specific rules
- Inheritance from popular style guides
- Version-controlled standards

**Example Configuration:**

```yaml
# .antislop-team.yml
team:
  name: acme-engineering
  version: 2.1.0
  
extends:
  - eslint:recommended
  - airbnb-base
  - typescript-strict

rules:
  # Custom team rules
  no-console-log: error
  require-jsdoc: 
    severity: warn
    exclude: ['*.test.ts', '*.spec.ts']
  max-function-params: 4
  
  # Framework-specific
  react/no-direct-dom: error
  nextjs/no-sync-routes: error
  
  # Performance
  no-unnecessary-await: warn
  prefer-readonly: error

templates:
  - react-functional-component
  - nextjs-api-route
  - typescript-interface
```

### 2. Code Review Integration

**GitHub Integration:**

```yaml
# .github/workflows/quality.yml
name: Code Quality

on:
  pull_request:
    branches: [main, develop]

jobs:
  antislop:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Quality Check
        uses: mednabouli/claude-antislop@v1
        with:
          team-id: acme-corp
          min-score: 85
          comment-on-pr: true
          fail-threshold: error
          
      - name: Post Results to Slack
        if: always()
        uses: slack-api/notify@v1
        with:
          channel: '#code-quality'
          message: "PR #${{ github.event.number }} quality: ${{ steps.antislop.outputs.score }}/100"
```

**PR Comment Example:**

```markdown
## 📊 Code Quality Report

**Overall Score:** 87/100 ✅

### Summary
- ✅ 42 files passed
- ⚠️ 3 files with warnings
- ❌ 1 file with errors

### Top Issues

1. **Missing TypeScript types** (3 occurrences)
   - `src/utils/helpers.ts`
   - `src/api/users.ts`

2. **Console.log statements** (2 occurrences)
   - `src/components/Dashboard.tsx`
   - `src/pages/index.tsx`

[View full report →](https://app.claude-antislop.dev/reports/123)
```

### 3. Team Dashboard

**Features:**

- **Quality Trends** - See improvement over time
- **Team Leaderboard** - Friendly competition
- **Hotspot Detection** - Find problematic files
- **Standards Compliance** - Track adoption

**Dashboard Views:**

```
┌────────────────────────────────────────────┐
│  Team Quality Dashboard - Acme Corp        │
├────────────────────────────────────────────┤
│                                            │
│  Average Score: 87/100 ▲ 12% this month   │
│                                            │
│  📈 Trend                                  │
│  90 ┤                              ╭──╮    │
│  85 ┤                      ╭──╮    │  │    │
│  80 ┤              ╭──╮    │  │    │  │    │
│  75 ┤      ╭──╮    │  │    │  │    │  │    │
│  70 ┤  ╭───╯  ╰────╯  ╰────╯  ╰────╯  ╰──  │
│     └────────────────────────────────────  │
│     Sep   Oct   Nov   Dec   Jan   Feb      │
│                                            │
│  🏆 Top Repositories                       │
│  1. api-service      94/100  ▲ 5%          │
│  2. web-app          91/100  ▲ 8%          │
│  3. mobile-backend   88/100  ▲ 3%          │
│                                            │
│  ⚠️ Needs Attention                        │
│  1. legacy-parser    62/100  ▼ 2%          │
│  2. old-utils        71/100  ─ 0%          │
│                                            │
└────────────────────────────────────────────┘
```

---

## Setup Guide

### Step 1: Create Team Account

```bash
# Register team
claude-antislop team register --name "Acme Engineering"

# Get team ID
claude-antislop team info
# Team ID: team_acme123
```

### Step 2: Configure Standards

```bash
# Initialize team standards
claude-antislop standards init --team team_acme123

# Edit standards
claude-antislop standards edit

# Validate standards
claude-antislop standards validate
```

### Step 3: Integrate with CI/CD

```yaml
# Add to your CI workflow
- name: Check Code Quality
  uses: mednabouli/claude-antislop@v1
  with:
    team-id: ${{ secrets.ANTISLOP_TEAM_ID }}
    api-key: ${{ secrets.ANTISLOP_API_KEY }}
```

### Step 4: Invite Team Members

```bash
# Invite developer
claude-antislop team invite --email dev@acme.com --role developer

# List members
claude-antislop team members

# Update role
claude-antislop team update-role --user dev@acme.com --role admin
```

---

## Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Admin** | Manage standards, view all repos, invite members |
| **Maintainer** | Edit standards, view reports, approve PRs |
| **Developer** | View standards, run scans, see own reports |
| **Viewer** | Read-only access to dashboard |

---

## Best Practices

### 1. Start Small

```yaml
# Begin with minimal rules
rules:
  no-console-log: error
  require-return-type: warn
  
# Gradually add more as team adapts
```

### 2. Get Team Buy-in

- Discuss standards in team meeting
- Vote on contentious rules
- Allow exceptions for legacy code
- Celebrate improvements

### 3. Automate Everything

- CI/CD integration
- PR comments
- Slack notifications
- Weekly reports

### 4. Review Regularly

- Monthly standards review
- Quarterly team survey
- Adjust based on feedback
- Remove unused rules

---

## Integration Examples

### Slack Notifications

```yaml
# .antislop-slack.yml
notifications:
  slack:
    webhook: $SLACK_WEBHOOK
    events:
      - scan-complete
      - quality-degraded
      - pr-reviewed
    channels:
      scan-complete: '#code-quality'
      quality-degraded: '#alerts'
```

### Linear Integration

```javascript
// Auto-create tickets for critical issues
antislop.on('critical-issue', async (issue) => {
  await linear.createIssue({
    title: `Fix ${issue.type} in ${issue.file}`,
    description: issue.description,
    teamId: 'engineering',
    priority: 'high',
    labels: ['code-quality', 'antislop']
  });
});
```

### Jira Integration

```yaml
# jira-config.yml
jira:
  project: ENG
  issueType: Task
  labels:
    - code-quality
  assignee: currentUser()
  watchers:
    - tech-lead
```

---

## Metrics & Reporting

### Team Metrics

- **Average Quality Score** - Team-wide average
- **Standards Compliance** - % of repos following standards
- **Issues Resolved** - Count of fixed issues
- **Response Time** - Time to fix critical issues

### Individual Metrics

- **Personal Score** - Developer's average
- **Improvement Rate** - Month-over-month change
- **PR Quality** - Average score on PRs
- **Standards Adherence** - Rule compliance rate

### Sample Report

```markdown
## Weekly Quality Report - Week 47

### Team Performance
- Average Score: 87/100 (▲ 3%)
- Scans Run: 234
- Issues Fixed: 89
- Critical Issues: 2 (resolved)

### Top Contributors
1. @alice - 95/100 average
2. @bob - 92/100 average
3. @carol - 89/100 average

### Focus Areas for Next Week
- Reduce console.log usage (12 remaining)
- Add TypeScript types to utils (8 files)
- Refactor legacy-parser module

### Shoutouts 🎉
- @alice for refactoring auth module (+28 points)
- @bob for adding comprehensive tests
```

---

## Troubleshooting

### Common Issues

**Problem:** Standards not applying

**Solution:**
```bash
# Verify team ID
claude-antislop team info

# Re-sync standards
claude-antislop standards sync

# Check file location
ls -la .antislop-team.yml
```

**Problem:** CI/CD failing

**Solution:**
```yaml
# Add debug output
- name: Debug
  run: |
    echo "Team ID: $ANTISLOP_TEAM_ID"
    claude-antislop --version
    claude-antislop standards validate
```

---

*Part of Claude Antislop Advanced Features*
