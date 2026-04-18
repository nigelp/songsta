# Songsta - Suno Song Prompt Generator

A minimal viable Electron application that generates Suno-compatible song prompts and lyrics using the V6.6 Suno Bible framework.

## Features

- **V6.6 Suno Bible Framework**: Complete rule engine enforcing all V6.6 constraints
- **Input Fields**: Theme, Angle, Emotion, Genre, and Structural Preferences
- **Output Format**: Block 1+2 (paste-ready), Block 3 (Performance Notes), Title Suggestions
- **Diagnostic UI**: 7-point validation scoring before export
- **Save/Load**: Local generation history with persistent storage
- **One-Click Copy**: Copy each output block independently
- **Fully Offline**: No external API dependencies

## Project Structure

```
songsta/
├── package.json
├── forge.config.js
├── README.md
├── src/
│   ├── main.js                    # Electron main process
│   ├── preload.js                 # Secure IPC bridge
│   ├── engine/
│   │   ├── index.js               # Engine entry point
│   │   ├── rules.js               # V6.6 rule definitions
│   │   ├── syllable.js            # Syllable counting & validation
│   │   ├── rhyme.js               # Rhyme scheme analysis
│   │   ├── intensity.js           # Intensity curve tracking
│   │   ├── contrast.js            # Section contrast validation
│   │   ├── punctuation.js         # Punctuation control
│   │   ├── format.js              # Output format locks
│   │   ├── diagnostic.js          # 7-point scoring system
│   │   ├── generator.js           # Main generation logic
│   │   └── templates.js           # V6.6 output templates
│   └── renderer/
│       ├── index.html             # Main UI
│       ├── styles.css             # Application styling
│       └── renderer.js            # UI logic & engine integration
```

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation

1. Clone or navigate to the project directory:
   ```bash
   cd songsta
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Run the app in development mode:
```bash
npm start
```

This will launch the Electron window with hot-reloading enabled.

## Building

### Create distributable package:

```bash
npm run make
```

This will create platform-specific installers in the `out/` directory:
- **Windows**: `out/make/zip/win32/x64/Songsta-win32-x64-1.0.0.zip`
- **macOS**: `out/make/zip/darwin/x64/Songsta-darwin-x64-1.0.0.zip`
- **Linux**: `out/make/zip/linux/x64/Songsta-linux-x64-1.0.0.zip`

## Usage

1. **Fill in inputs**:
   - **Theme**: What the song is about (e.g., "breaking free", "lost love")
   - **Angle**: What makes this take different (e.g., "from the inside out")
   - **Emotion**: Dominant felt state (e.g., "determined", "melancholic")
   - **Genre**: Choose from Pop, Rock, Punk, Rap, EDM, Ballad, etc.
   - **Structure**: Standard, Rap, EDM, or Ballad structure

2. **Click "Generate Song"** to create the output

3. **Review Diagnostic Score**: The app scores output against 7 criteria:
   - Chorus Punch
   - Line Clarity
   - Rhythm Consistency
   - Energy Progression
   - Hook Identity
   - Ending Impact
   - Uniqueness

4. **Copy Output Blocks**: Use the Copy buttons to copy each block independently

5. **Save Generation**: Click "Save" to store the generation locally

6. **Load History**: Click any saved generation in the left panel to reload it

## V6.6 Rule Engine

The engine enforces the following constraints:

### Syllable Targeting
- 8-12 syllables per line (genre-dependent)
- +/- 2 syllable variation within sections

### Rhyme Architecture
- Configurable rhyme schemes per section (AABB, ABAB, AAAA)
- Internal rhyme detection and scoring

### Intensity Curves
- Deliberate macro-curve progression
- Section-specific intensity levels
- Final chorus escalation enforcement

### Section Contrast
- Each section must change at least 2 variables
- Bridge must shift perspective, intensity, or rhythm

### Punctuation Control
- Period = hard stop
- Comma = soft carry
- Ellipsis = rare tension drag (limited usage)

### Formatting Locks
- Block 1: Single-line style block in square brackets
- Block 2: Section headers on own lines, lyrics below
- Block 3: Performance Notes, Alt Hook Options, Concept
- Titles: Separate from paste-ready section

### 7-Point Diagnostic
1. Chorus Punch
2. Line Clarity
3. Rhythm Consistency
4. Energy Progression
5. Hook Identity
6. Ending Impact
7. Uniqueness

Score must be >= 5/7 to pass validation.

## Genre Adaptation

The engine adapts output based on genre selection:

| Genre | Tempo | Line Density | Rhyme Complexity | Chorus Type |
|-------|-------|--------------|------------------|-------------|
| Pop | Mid | Medium | Simple | Anthemic |
| Rock | Mid | Medium | Simple-Punchy | Anthemic |
| Punk | Fast | High | Simple-Punchy | Anthemic |
| Rap | Fast | High | Complex | Rhythmic |
| EDM | Fast | Low | Minimal | Drop-based |
| Ballad | Slow | Low | Minimal-Natural | Melodic |

## License

MIT