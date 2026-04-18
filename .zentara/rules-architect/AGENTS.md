# Architect Mode Rules

This file provides architecture-specific guidance for agents working with this repository.

## Architecture Constraints

- **Three-process model**: Main process (Node.js) ↔ Preload (contextBridge) ↔ Renderer (webview) - respect process boundaries
- **IPC is the only communication**: No shared state between main and renderer - all data flows through IPC
- **Engine is stateless**: `src/engine/` modules are pure functions - no internal state or caching
- **Filesystem persistence**: Generations saved to `GENERATIONS_DIR` as JSON files - no database
- **localStorage for settings**: API key and UI preferences use renderer `localStorage` - cleared if user clears site data
- **No external services**: Only external dependency is OpenRouter API - no other network calls
- **Single window app**: No multi-window support - `BrowserWindow` is singleton
- **ASAR packaging**: Production builds use ASAR archive - filesystem paths must work within ASAR