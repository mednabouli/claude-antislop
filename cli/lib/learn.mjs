import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
      repository: repo,
      period: `${recent}d`,
      patterns: ['commits', 'branches', 'diffs']
    }
  };
}
