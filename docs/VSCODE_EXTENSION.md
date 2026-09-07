# VS Code Extension

The repository includes a VS Code extension scaffold in `vscode-extension/`. It integrates the local Claude Anti-Slop CLI into the Command Palette and status bar.

## Included Commands

- Run the first-run wizard in an integrated terminal
- Check CLI status
- Scan the open workspace
- Search local memory
- Check the current editor selection or document

## Build Locally

```bash
cd vscode-extension
npm install
npm run compile
```

Press `F5` in VS Code to launch the extension in an Extension Development Host.

## Package

```bash
npm run package
```

Install the generated VSIX from **Extensions: Install from VSIX**.

## Requirements

The extension invokes the `claude-antislop` executable with `--json`; install the CLI globally or set `claudeAntislop.cliPath` to the executable path.
