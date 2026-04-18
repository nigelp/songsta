# Debug Mode Rules

This file provides debugging-specific guidance for agents working with this repository.

## Debugging Gotchas

- **No test framework**: No automated tests exist - manual testing required via `npm start`
- **No linting**: No ESLint configured - syntax errors only caught at runtime
- **IPC silent failures**: IPC handlers return `{ success: false, error }` - check return objects, not console
- **Two persistence layers**: API key in `localStorage`, generations in filesystem (`GENERATIONS_DIR`) - check both when debugging state issues
- **OpenRouter API errors**: Status codes 401 (invalid key), 429 (rate limit), 500 (server error) - check error messages in renderer
- **Electron dev tools**: Use `Ctrl+Shift+I` for renderer dev tools, main process logs to terminal
- **File operations**: IPC handlers use `fs.promises` - async file ops can fail silently if directory doesn't exist
- **No logging framework**: Debug via `console.log` in terminal (main) and DevTools console (renderer)