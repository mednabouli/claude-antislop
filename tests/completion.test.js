import { getCompletionScript } from '../cli/lib/completion.mjs';

describe('Completion Commands', () => {
  it('should return bash completion script', async () => {
    const script = await getCompletionScript('bash');
    expect(script).toContain('_complete_claude_antislop');
    expect(script).toContain('complete -F _complete_claude_antislop');
  });

  it('should return zsh completion script', async () => {
    const script = await getCompletionScript('zsh');
    expect(script).toContain('#compdef claude-antislop');
  });

  it('should return fish completion script', async () => {
    const script = await getCompletionScript('fish');
    expect(script).toContain('# Fish completion for claude-antislop');
  });
});
