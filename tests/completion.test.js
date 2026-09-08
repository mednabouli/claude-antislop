import { describe, it, expect } from '@jest/globals';
import { getSupportedShells, getCompletionScript } from '../cli/lib/completion.mjs';

describe('Completion Commands', () => {
  it('should return supported shells', () => {
    const shells = getSupportedShells();
    expect(shells).toContain('bash');
    expect(shells).toContain('zsh');
    expect(shells).toContain('fish');
  });

  it('should return bash completion script', async () => {
    const script = await getCompletionScript('bash');
    expect(script).toContain('_claude_antislop');
    expect(script).toContain('complete -F _claude_antislop');
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
