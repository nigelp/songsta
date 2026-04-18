# Ask Mode Rules

This file provides documentation context for agents working with this repository.

## Documentation Context

- **No code comments**: All code is self-documenting through names - no inline documentation exists
- **No README for engine**: `src/engine/` modules have no documentation - read source code for understanding
- **OpenRouter API**: External API at `https://openrouter.ai/api/v1` - check their docs for model details
- **Electron Forge docs**: Build system uses Electron Forge 7.2 - refer to official docs for build issues
- **Config sources**: `GENRE_CONFIGS` and `STRUCTURE_VARIANTS` in `src/engine/rules.js` are the canonical references
- **No TypeScript**: Pure JavaScript - no type definitions or interfaces to reference
- **API key storage**: Stored in renderer `localStorage`, not in config files