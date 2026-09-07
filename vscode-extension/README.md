# Claude Anti-Slop for VS Code

A VS Code companion for the Claude Anti-Slop CLI. It keeps code-quality memory and local automation accessible from the Command Palette.

## Features

- Status-bar indicator with one-click CLI status checks
- Run the interactive setup wizard in an integrated terminal
- Scan the currently opened workspace
- Search Claude Anti-Slop memory in an output panel
- Run quality checks against the active selection (or full document)
- Convert returned issues into VS Code diagnostics when supported by the CLI response

## Prerequisites

Install and configure the CLI first:

```bash
npm install -g claude-antislop
claude-antislop wizard
```

## Development

```bash
cd vscode-extension
npm install
npm run compile
```

Open `vscode-extension` in VS Code, then press `F5` to launch an Extension Development Host.

## Commands

- `Claude Anti-Slop: Run Setup Wizard`
- `Claude Anti-Slop: Show Status`
- `Claude Anti-Slop: Scan Workspace`
- `Claude Anti-Slop: Search Memory`
- `Claude Anti-Slop: Check Selection`

## Settings

- `claudeAntislop.cliPath`: CLI executable or absolute path, default `claude-antislop`
- `claudeAntislop.enableDiagnostics`: Enable diagnostics from quality-check results
- `claudeAntislop.locale`: Optional locale override (`en`, `fr`, `es`, `de`, `zh`, `ja`)

## Packaging

```bash
npm run package
```

This creates a `.vsix` package that can be installed with VS Code's **Extensions: Install from VSIX** command.
