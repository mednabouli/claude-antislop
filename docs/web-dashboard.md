# Web Dashboard

## Overview

The Claude Antislop Web Dashboard provides a centralized interface for monitoring code quality, tracking team performance, and managing standards across all your repositories.

---

## Features

### 1. Real-Time Monitoring

**Live Metrics:**
- Repository health scores
- Active scans
- Recent issues
- Team activity feed

**Tech Stack:**
- **Frontend:** Next.js 15 (App Router)
- **Backend:** Supabase (real-time)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **State:** Zustand

### 2. Repository Analytics

**Views:**

```
┌─────────────────────────────────────────────┐
│  Repositories                        [🔍]  │
├─────────────────────────────────────────────┤
│                                             │
│  📦 api-service                             │
│     Score: 94/100 ▲ 5%  │  Last: 2h ago    │
│     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 94%      │
│     156 files  │  3 issues  │  2 warnings  │
│                                             │
│  📦 web-app                                 │
│     Score: 91/100 ▲ 8%  │  Last: 5h ago    │
│     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 91%      │
│     342 files  │  12 issues  │  8 warnings │
│                                             │
│  📦 mobile-backend                          │
│     Score: 88/100 ▲ 3%  │  Last: 1d ago    │
│     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 88%      │
│     89 files  │  5 issues  │  2 warnings   │
│                                             │
└─────────────────────────────────────────────┘
```

### 3. Quality Trends

**Charts:**

```typescript
// Quality trend over time
const qualityTrend = {
  labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
  datasets: [{
    label: 'Average Score',
    data: [75, 78, 82, 85, 87, 89],
    borderColor: '#3b82f6',
    tension: 0.4
  }]
};

// Issue distribution
const issueDistribution = {
  labels: ['Error', 'Warning', 'Info'],
  datasets: [{
    data: [12, 45, 89],
    backgroundColor: [
      '#ef4444', // red
      '#f59e0b', // amber
      '#3b82f6'  // blue
    ]
  }]
};
```

### 4. Issue Tracking

**Features:**
- Filter by severity
- Assign to team members
- Track resolution
- Link to Jira/Linear

**Issue Detail View:**

```markdown
## Issue #1234: Missing TypeScript Types

**Repository:** api-service  
**File:** `src/utils/helpers.ts:45`  
**Severity:** ⚠️ Warning  
**Status:** 🟡 In Progress  
**Assigned to:** @alice  

### Description
Function `parseUserData` has implicit `any` return type.

### Suggestion
```typescript
// Before
function parseUserData(data) {
  return JSON.parse(data);
}

// After
function parseUserData(data: string): UserData {
  return JSON.parse(data);
}
```

### Actions
- [x] Acknowledge
- [ ] Fix
- [ ] Ignore
- [ ] Create ticket
```

---

## Architecture

### System Design

```
┌──────────────┐     ┌──────────────┐
│   Next.js    │────▶│   Supabase   │
│   Dashboard  │◀────│   Real-time  │
└──────────────┘     └──────────────┘
       │                    │
       │                    │
       ▼                    ▼
┌──────────────┐     ┌──────────────┐
│  Tailwind    │     │  Redis Cache │
│   CSS        │     │              │
└──────────────┘     └──────────────┘
```

### Database Schema

```sql
-- Teams
table teams (
  id uuid primary key,
  name text,
  created_at timestamp,
  plan text
);

-- Repositories
table repositories (
  id uuid primary key,
  team_id uuid references teams,
  name text,
  url text,
  last_scan timestamp
);

-- Scans
table scans (
  id uuid primary key,
  repo_id uuid references repositories,
  score integer,
  issues_count integer,
  created_at timestamp
);

-- Issues
table issues (
  id uuid primary key,
  scan_id uuid references scans,
  file text,
  line integer,
  severity text,
  message text,
  status text,
  assignee_id uuid
);
```

---

## Setup

### Local Development

```bash
# Clone dashboard repo
git clone https://github.com/mednabouli/claude-antislop-dashboard
cd claude-antislop-dashboard

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local

# Run dev server
pnpm dev
```

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret

GITHUB_CLIENT_ID=your-github-id
GITHUB_CLIENT_SECRET=your-github-secret
```

### Deployment

```bash
# Build
pnpm build

# Deploy to Vercel
vercel deploy --prod

# Or Docker
docker build -t antislop-dashboard .
docker run -p 3000:3000 antislop-dashboard
```

---

## API Reference

### Get Repository Stats

```typescript
GET /api/repos/:id/stats

Response:
{
  id: "repo_123",
  name: "api-service",
  score: 94,
  trend: [85, 87, 89, 91, 94],
  issues: {
    total: 15,
    critical: 2,
    warning: 8,
    info: 5
  },
  lastScan: "2026-09-07T23:00:00Z"
}
```

### Get Team Dashboard

```typescript
GET /api/team/:id/dashboard

Response:
{
  team: {
    name: "Acme Engineering",
    memberCount: 12,
    repoCount: 8
  },
  metrics: {
    avgScore: 87,
    totalScans: 234,
    issuesResolved: 156,
    trend: "up"
  },
  topRepos: [...],
  needsAttention: [...]
}
```

### Create Issue Comment

```typescript
POST /api/issues/:id/comments

Body:
{
  text: "I'll fix this in the next PR",
  assignee: "user_456"
}

Response:
{
  id: "comment_789",
  text: "I'll fix this in the next PR",
  author: "@alice",
  createdAt: "2026-09-07T23:00:00Z"
}
```

---

## Components

### ScoreCard

```tsx
interface ScoreCardProps {
  score: number;
  trend: 'up' | 'down' | 'neutral';
  label: string;
}

function ScoreCard({ score, trend, label }: ScoreCardProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{label}</h3>
        <TrendIndicator trend={trend} />
      </div>
      <div className="mt-4">
        <span className="text-4xl font-bold">
          {score}
        </span>
        <span className="text-gray-500">/100</span>
      </div>
      <ProgressBar value={score} />
    </div>
  );
}
```

### IssueList

```tsx
interface IssueListProps {
  issues: Issue[];
  onAssign: (issueId: string, userId: string) => void;
}

function IssueList({ issues, onAssign }: IssueListProps) {
  return (
    <div className="space-y-4">
      {issues.map(issue => (
        <IssueCard
          key={issue.id}
          issue={issue}
          onAssign={onAssign}
        />
      ))}
    </div>
  );
}
```

---

## Security

### Authentication

- GitHub OAuth
- Email/password (enterprise)
- SSO/SAML (enterprise)

### Authorization

- Role-based access control
- Team-level permissions
- Repository-level access

### Data Protection

- HTTPS only
- Encrypted at rest
- SOC 2 compliant
- GDPR compliant

---

## Performance

### Targets

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

### Optimizations

- Server-side rendering
- Static generation for dashboards
- Incremental static regeneration
- Image optimization
- Code splitting

---

## Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] Slack bot integration
- [ ] Custom widgets
- [ ] Export to PDF/CSV
- [ ] Webhook notifications
- [ ] Custom themes
- [ ] Dark mode

---

*Part of Claude Antislop Advanced Features*
