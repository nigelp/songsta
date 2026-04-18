const GENRE_CONFIGS = {
  'pop': {
    tempo: 'mid',
    lineDensity: 'medium',
    rhymeComplexity: 'simple',
    vocabulary: 'direct, relatable',
    rhythmPriority: 'balance',
    spaceVsFill: 'balanced',
    hookPlacement: 'chorus identity',
    energyCurve: 'rise -> explode -> sustain',
    structure: 'standard',
    chorusType: 'anthemic',
  },
  'rock': {
    tempo: 'mid',
    lineDensity: 'medium',
    rhymeComplexity: 'simple-punchy',
    vocabulary: 'physical, action-oriented',
    rhythmPriority: 'balance',
    spaceVsFill: 'fill',
    hookPlacement: 'chorus identity',
    energyCurve: 'rise -> explode -> sustain',
    structure: 'standard',
    chorusType: 'anthemic',
  },
  'punk': {
    tempo: 'fast',
    lineDensity: 'high',
    rhymeComplexity: 'simple-punchy',
    vocabulary: 'physical, aggressive, raw',
    rhythmPriority: 'rhythm',
    spaceVsFill: 'fill',
    hookPlacement: 'chorus identity',
    energyCurve: 'steady high',
    structure: 'standard',
    chorusType: 'anthemic',
  },
  'rap': {
    tempo: 'fast',
    lineDensity: 'high',
    rhymeComplexity: 'complex-multisyllabic',
    vocabulary: 'sharp, layered',
    rhythmPriority: 'rhythm',
    spaceVsFill: 'fill',
    hookPlacement: 'repeatable hook phrase',
    energyCurve: 'steady or escalating',
    structure: 'rap',
    chorusType: 'rhythmic',
  },
  'edm': {
    tempo: 'fast',
    lineDensity: 'low',
    rhymeComplexity: 'minimal',
    vocabulary: 'abstract, sensory',
    rhythmPriority: 'drop timing',
    spaceVsFill: 'space',
    hookPlacement: 'drop phrase',
    energyCurve: 'build -> drop -> break -> drop',
    structure: 'edm',
    chorusType: 'drop-based',
  },
  'ballad': {
    tempo: 'slow',
    lineDensity: 'low',
    rhymeComplexity: 'minimal-natural',
    vocabulary: 'emotional, relational',
    rhythmPriority: 'melody',
    spaceVsFill: 'space',
    hookPlacement: 'emotional peak',
    energyCurve: 'slow rise -> peak -> fall',
    structure: 'ballad',
    chorusType: 'melodic',
  },
  'alt-rock': {
    tempo: 'mid',
    lineDensity: 'medium',
    rhymeComplexity: 'simple',
    vocabulary: 'abstract, introspective',
    rhythmPriority: 'balance',
    spaceVsFill: 'balanced',
    hookPlacement: 'chorus identity',
    energyCurve: 'rise -> explode -> sustain',
    structure: 'standard',
    chorusType: 'melodic',
  },
  'rnb': {
    tempo: 'mid',
    lineDensity: 'medium',
    rhymeComplexity: 'moderate',
    vocabulary: 'emotional, sensual',
    rhythmPriority: 'melody',
    spaceVsFill: 'space',
    hookPlacement: 'emotional peak',
    energyCurve: 'slow rise -> peak',
    structure: 'standard',
    chorusType: 'melodic',
  },
  'country': {
    tempo: 'mid',
    lineDensity: 'medium',
    rhymeComplexity: 'simple',
    vocabulary: 'narrative, grounded',
    rhythmPriority: 'balance',
    spaceVsFill: 'balanced',
    hookPlacement: 'chorus identity',
    energyCurve: 'steady rise -> peak',
    structure: 'standard',
    chorusType: 'anthemic',
  },
  'metal': {
    tempo: 'fast',
    lineDensity: 'high',
    rhymeComplexity: 'moderate',
    vocabulary: 'dark, intense, physical',
    rhythmPriority: 'rhythm',
    spaceVsFill: 'fill',
    hookPlacement: 'chorus identity',
    energyCurve: 'rise -> explode -> sustain',
    structure: 'standard',
    chorusType: 'anthemic',
  },
};

const STRUCTURE_VARIANTS = {
  'standard': ['Verse 1', 'Pre-Chorus', 'Chorus', 'Verse 2', 'Pre-Chorus', 'Chorus', 'Bridge', 'Final Chorus'],
  'rap': ['Verse 1', 'Hook', 'Verse 2', 'Hook', 'Bridge', 'Hook'],
  'edm': ['Build', 'Drop', 'Break', 'Drop'],
  'ballad': ['Verse 1', 'Chorus', 'Verse 2', 'Chorus', 'Bridge', 'Final Chorus'],
};

const SYLLABLE_TARGETS = {
  fast: { min: 6, max: 10, ideal: 8 },
  mid: { min: 8, max: 12, ideal: 10 },
  slow: { min: 10, max: 14, ideal: 12 },
};

const SECTION_PURPOSES = {
  'Verse 1': 'detail, scene, narrative, observation, or premise',
  'Verse 2': 'deepen or worsen the premise',
  'Pre-Chorus': 'tightening, compression, setup, pressure rise',
  'Chorus': 'identity, explosion, payoff, simplest language, highest recall',
  'Hook': 'repeatable anchor phrase, identity',
  'Bridge': 'contrast, pivot, or rupture',
  'Build': 'rising tension, anticipation',
  'Drop': 'release, energy explosion',
  'Break': 'contrast, minimal, tension reset',
  'Final Chorus': 'escalation, more force, more lift, or heavier texture',
};

const INTENSITY_CURVES = {
  'linear-rise': [2, 3, 5, 4, 6, 8, 7, 10],
  'rise-drop-surge': [2, 4, 7, 5, 6, 8, 6, 10],
  'chaotic-spikes': [3, 7, 5, 9, 4, 8, 6, 10],
  'steady-high': [7, 7, 8, 7, 8, 8, 9, 10],
  'slow-rise': [2, 3, 4, 5, 6, 7, 8, 9],
};

const FILLER_WORDS = ['that', 'just', 'really', 'kinda', 'sort of', 'a bit', 'and then', 'but now', 'so I', 'because I'];

const GENERIC_PHRASES = [
  'I feel alive', 'lost in the night', 'take me higher', 'another day',
  'I remember when', 'in my dreams', 'forever young', 'never let go',
];

const SFX_LIBRARY = {
  'impact': ['bass drop', 'distortion hit', 'impact slam'],
  'atmosphere': ['wind howl', 'distant echo', 'low rumble'],
  'mechanical': ['metal scrape', 'machine hum', 'gear grind'],
  'human': ['breath hit', 'heartbeat', 'crowd shout'],
  'glitch': ['glitch crackle', 'signal drop', 'data burst'],
};

const DIAGNOSTIC_CRITERIA = [
  { key: 'chorusPunch', label: 'Chorus Punch', description: 'Chorus is clean, punchy, chantable with short punch line' },
  { key: 'lineClarity', label: 'Line Clarity', description: 'Each line stands alone grammatically, one idea per line' },
  { key: 'rhythmConsistency', label: 'Rhythm Consistency', description: 'Syllable counts match within sections, stress patterns work' },
  { key: 'energyProgression', label: 'Energy Progression', description: 'Deliberate macro-curve, no flat energy' },
  { key: 'hookIdentity', label: 'Hook Identity', description: 'Unique phrase, repeatable rhythm pattern, memorable' },
  { key: 'endingImpact', label: 'Ending Impact', description: 'Final line resolves, escalates, or leaves sharp image' },
  { key: 'uniqueness', label: 'Uniqueness', description: 'No generic phrases, specific imagery, pattern twist present' },
];

module.exports = {
  GENRE_CONFIGS,
  STRUCTURE_VARIANTS,
  SYLLABLE_TARGETS,
  SECTION_PURPOSES,
  INTENSITY_CURVES,
  FILLER_WORDS,
  GENERIC_PHRASES,
  SFX_LIBRARY,
  DIAGNOSTIC_CRITERIA,
};