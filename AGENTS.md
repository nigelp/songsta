# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Overview

Songsta is an Electron desktop app for AI-powered lyric generation using OpenRouter API.

## Stack

- **Runtime**: Electron 28
- **Build**: Electron Forge 7.2
- **Language**: Vanilla JavaScript (CommonJS)
- **No framework** - pure JS, no React/Vue/etc.

## Commands

```bash
npm start          # electron-forge start - Launch app in dev mode
npm run package    # electron-forge package - Package without installers
npm run make       # electron-forge make - Create distributable installers
npm run publish    # electron-forge publish - Publish to distribution
```

**No test or lint scripts configured.**

## Architecture

```
Renderer (renderer.js)
    ↓ contextBridge
Preload (preload.js) → window.electronAPI
    ↓ IPC
Main (main.js) → IPC handlers
    ↓
Engine (src/engine/) → Rules, templates, generator
    ↓
API (src/utils/api.js) → OpenRouter
```

- **Main process**: 10 IPC handlers for file ops and API calls
- **Preload**: Exposes 6 methods via `contextBridge`
- **Engine**: Configuration + prompt construction (not local generation)
- **Renderer**: 35 functions for UI logic

## Key Directories

- `src/main.js` - Electron main process
- `src/preload.js` - Secure IPC bridge
- `src/engine/` - Business logic (rules, templates, generator)
- `src/renderer/` - UI (HTML/CSS/JS)
- `src/utils/` - API utilities
- `GENERATIONS_DIR` - Filesystem storage for saved lyrics

## Non-Obvious Patterns

- **Engine modules are for prompt construction**, not local lyric generation - actual generation delegates to OpenRouter API
- **Hybrid persistence**: API key/style use `localStorage`, generations use filesystem via IPC
- **Configuration duplication**: `GENRE_CONFIGS` and `STRUCTURE_VARIANTS` defined in both `rules.js` and re-exported from `index.js`
- **No ESLint/Prettier configured** - follow existing code style manually

## Code Style

- **Module system**: CommonJS (`require`/`module.exports`)
- **Naming**: `camelCase` for functions/vars, `UPPER_CASE` for constants, `kebab-case` for config keys
- **Functions**: `function` keyword for named functions, arrow functions for callbacks
- **Async**: `async/await` only (no `.then()` chains)
- **Strings**: Single quotes, template literals for interpolation
- **Indentation**: 2 spaces
- **Semicolons**: Required
- **No comments** in codebase - self-documenting through names

## Error Handling

- IPC handlers return `{ success: true/false, data/error }` objects
- API functions throw errors with status-specific messages (401, 429, 500)
- Renderer updates UI state on errors (loading → error display)