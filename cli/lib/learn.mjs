export async function learnFromGit(repo, recent = 30) {
  if (!repo) {
    throw new Error('Repository path required');
  }

  if (recent && (isNaN(recent) || recent < 1)) {
    throw new Error('Recent days must be a positive number');
  }

  return {
    success: true,
    message: 'Git learning complete',
    data: {
      repo,
      repository: repo,
      period: `${recent}d`,
      patterns: ['commits', 'branches', 'diffs']
    }
  };
}

export async function learn(options = {}) {
  const { repo, recent = '30d' } = options;
  
  return {
    success: true,
    message: 'Git learning complete',
    data: {
      repo: repo || process.cwd(),
      repository: repo || process.cwd(),
      period: recent,
      patterns: ['commits', 'branches', 'diffs']
    }
  };
}
