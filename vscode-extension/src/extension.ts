import * as vscode from 'vscode';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execFileAsync = promisify(execFile);
type CliResponse = { success: boolean; message: string; data?: unknown; hint?: string | null; };
export function activate(context: vscode.ExtensionContext): void {
  const diagnostics = vscode.languages.createDiagnosticCollection('claude-antislop');
  const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  status.command = 'claudeAntislop.showStatus';
  status.text = '$(shield) Anti-Slop';
  status.tooltip = 'Claude Anti-Slop: click to check status';
  status.show();
  const run = async (command: string, args: string[] = []): Promise<CliResponse> => {
    const config = vscode.workspace.getConfiguration('claudeAntislop');
    const cliPath = config.get<string>('cliPath', 'claude-antislop');
    const locale = config.get<string>('locale', '');
    const workspace = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    const cliArgs = [command, ...args, '--json'];
    if (locale) cliArgs.push('--locale', locale);
    try {
      const { stdout } = await execFileAsync(cliPath, cliArgs, { cwd: workspace, maxBuffer: 1024 * 1024 });
      return JSON.parse(stdout) as CliResponse;
    } catch (error: unknown) {
      const detail = error as { stdout?: string; message?: string };
      try { return JSON.parse(detail.stdout || '') as CliResponse; } catch { throw new Error(detail.message || 'Unable to run claude-antislop'); }
    }
  };
  const showResult = (result: CliResponse): void => {
    if (result.success) vscode.window.showInformationMessage(`Claude Anti-Slop: ${result.message}`);
    else vscode.window.showErrorMessage(`Claude Anti-Slop: ${result.message}${result.hint ? ` — ${result.hint}` : ''}`);
  };
  context.subscriptions.push(
    diagnostics, status,
    vscode.commands.registerCommand('claudeAntislop.runWizard', async () => {
      const terminal = vscode.window.createTerminal('Claude Anti-Slop Setup');
      terminal.show();
      terminal.sendText(`${vscode.workspace.getConfiguration('claudeAntislop').get<string>('cliPath', 'claude-antislop')} wizard`);
    }),
    vscode.commands.registerCommand('claudeAntislop.showStatus', async () => {
      try {
        const result = await run('status');
        status.text = result.success ? '$(shield) Anti-Slop: ready' : '$(warning) Anti-Slop: attention';
        showResult(result);
      } catch (error) { vscode.window.showErrorMessage(`Claude Anti-Slop: ${String(error)}`); }
    }),
    vscode.commands.registerCommand('claudeAntislop.scanWorkspace', async () => {
      const workspace = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
      if (!workspace) return vscode.window.showWarningMessage('Open a folder before scanning.');
      try { showResult(await run('scan', ['--repo', workspace])); } catch (error) { vscode.window.showErrorMessage(`Claude Anti-Slop: ${String(error)}`); }
    }),
    vscode.commands.registerCommand('claudeAntislop.searchMemory', async () => {
      const query = await vscode.window.showInputBox({ prompt: 'Search Claude Anti-Slop memory', placeHolder: 'e.g. error handling' });
      if (!query) return;
      try {
        const result = await run('memory-search', ['--query', query]);
        const output = vscode.window.createOutputChannel('Claude Anti-Slop Memory');
        output.clear(); output.appendLine(JSON.stringify(result, null, 2)); output.show();
      } catch (error) { vscode.window.showErrorMessage(`Claude Anti-Slop: ${String(error)}`); }
    }),
    vscode.commands.registerCommand('claudeAntislop.checkSelection', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const code = editor.document.getText(editor.selection) || editor.document.getText();
      if (!code.trim()) return vscode.window.showWarningMessage('Select code or open a non-empty editor.');
      try {
        const language = editor.document.languageId === 'javascript' ? 'javascript' : 'typescript';
        const result = await run('code-quality-check', ['--code', code, '--language', language]);
        showResult(result);
        if (!vscode.workspace.getConfiguration('claudeAntislop').get<boolean>('enableDiagnostics', true)) return;
        diagnostics.delete(editor.document.uri);
        const issues = (result.data as { issues?: Array<{ message?: string; line?: number; column?: number; severity?: string }> } | undefined)?.issues || [];
        const entries = issues.map(issue => new vscode.Diagnostic(
          new vscode.Range(Math.max((issue.line || 1) - 1, 0), Math.max((issue.column || 1) - 1, 0), Math.max((issue.line || 1) - 1, 0), Math.max(issue.column || 1, 1)),
          issue.message || 'Claude Anti-Slop quality issue',
          issue.severity === 'warning' ? vscode.DiagnosticSeverity.Warning : vscode.DiagnosticSeverity.Error
        ));
        if (entries.length) diagnostics.set(editor.document.uri, entries);
      } catch (error) { vscode.window.showErrorMessage(`Claude Anti-Slop: ${String(error)}`); }
    })
  );
}
export function deactivate(): void {}
