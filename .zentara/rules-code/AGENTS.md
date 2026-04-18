# Code Mode Rules

This file provides coding-specific guidance for agents working with this repository.

## Critical Coding Rules

- **CommonJS only**: Use `require()`/`module.exports`, never ES modules (`import`/`export`)
- **No framework code**: Pure vanilla JavaScript - no React, Vue, or other frameworks
- **Engine modules are prompt builders**: `src/engine/` constructs prompts for OpenRouter, does NOT generate lyrics locally
- **IPC return pattern**: Always return `{ success: boolean, data?: any, error?: string }` from IPC handlers
- **API error handling**: Throw errors with status-specific messages (401 → 'Invalid API key', 429 → 'Rate limit', 500 → 'Server error')
- **No ESLint/Prettier**: Follow existing code style manually - 2 space indent, semicolons, single quotes
- **Function naming**: `handle*` for event handlers, `load*`/`save*` for data ops, `display*` for UI ops
- **Config key format**: Use `kebab-case` for config object keys (e.g., `'alt-rock'`, `'linear-rise'`)
- **No comments**: Code is self-documenting through descriptive names only