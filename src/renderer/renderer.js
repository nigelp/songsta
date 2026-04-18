let currentLyrics = null;
let currentStyle = null;
let currentPrompt = null;
let availableModels = [];
let modelsLoaded = false;
let renameTargetId = null;

const GENRE_CONFIGS = {
  'pop': { tempo: 'mid-tempo', feel: 'catchy, relatable', production: 'polished pop production', vocals: 'clear, bright vocals' },
  'rock': { tempo: 'mid-tempo', feel: 'driving, energetic', production: 'rock production', vocals: 'determined vocals' },
  'punk': { tempo: 'fast-tempo', feel: 'raw, aggressive', production: 'raw punk production', vocals: 'aggressive vocals' },
  'rap': { tempo: 'fast-tempo', feel: 'sharp, rhythmic', production: 'hip-hop production', vocals: 'rhythmic flow' },
  'edm': { tempo: 'fast-tempo', feel: 'electronic, pulsing', production: 'electronic production', vocals: 'minimal, processed vocals' },
  'ballad': { tempo: 'slow-tempo', feel: 'emotional, intimate', production: 'sparse, acoustic production', vocals: 'expressive, dynamic vocals' },
  'alt-rock': { tempo: 'mid-tempo', feel: 'introspective, textured', production: 'layered alt-rock production', vocals: 'mellow, layered vocals' },
  'rnb': { tempo: 'mid-tempo', feel: 'smooth, sensual', production: 'smooth R&B production', vocals: 'soulful, melismatic vocals' },
  'country': { tempo: 'mid-tempo', feel: 'narrative, grounded', production: 'acoustic country production', vocals: 'warm, storytelling vocals' },
  'metal': { tempo: 'fast-tempo', feel: 'dark, intense', production: 'heavy metal production', vocals: 'powerful, aggressive vocals' },
};

const STRUCTURE_LABELS = {
  'standard': 'Verse/Pre-Chorus/Chorus structure',
  'rap': 'Verse/Hook structure',
  'edm': 'Build/Drop structure',
  'ballad': 'Verse/Chorus/Bridge structure',
};

const DEFAULT_SYSTEM_PROMPT = `You are a professional lyricist. Write song lyrics based on the user's description.
Do not include any explanations, only output the lyrics.
Use section markers like [Verse 1], [Chorus], [Bridge], [Outro], etc.
Make the lyrics creative, non-cliché, and emotionally resonant.`;

document.addEventListener('DOMContentLoaded', () => {
  const generateBtn = document.getElementById('generateBtn');
  const saveBtn = document.getElementById('saveBtn');
  const refreshHistoryBtn = document.getElementById('refreshHistory');
  const apiKeyInput = document.getElementById('apiKey');
  const modelSelector = document.getElementById('modelSelector');
  const structureSelect = document.getElementById('structure');
  const customStructureInput = document.getElementById('customStructure');
  const additionalStylesInput = document.getElementById('additionalStyles');
  const renameModal = document.getElementById('renameModal');
  const renameInput = document.getElementById('renameInput');
  const renameCancel = document.getElementById('renameCancel');
  const renameConfirm = document.getElementById('renameConfirm');

  generateBtn.addEventListener('click', handleGenerate);
  saveBtn.addEventListener('click', handleSave);
  refreshHistoryBtn.addEventListener('click', loadHistory);
  apiKeyInput.addEventListener('change', handleApiKeyChange);
  modelSelector.addEventListener('change', handleModelChange);
  structureSelect.addEventListener('change', handleStructureChange);
  additionalStylesInput.addEventListener('change', saveAdditionalStyles);
  renameCancel.addEventListener('click', closeRenameModal);
  renameConfirm.addEventListener('click', confirmRename);
  renameModal.addEventListener('click', (e) => {
    if (e.target === renameModal) closeRenameModal();
  });
  renameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') confirmRename();
    if (e.key === 'Escape') closeRenameModal();
  });

  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', handleCopy);
  });

  loadSavedApiKey();
  loadSavedAdditionalStyles();
  loadSavedCustomStructure();
  loadHistory();
});

function loadSavedApiKey() {
  const savedKey = localStorage.getItem('openrouter_api_key');
  if (savedKey) {
    document.getElementById('apiKey').value = savedKey;
    fetchModels(savedKey);
  }
}

function saveApiKey(key) {
  localStorage.setItem('openrouter_api_key', key);
}

function loadSavedAdditionalStyles() {
  const saved = localStorage.getItem('additional_styles');
  if (saved) {
    document.getElementById('additionalStyles').value = saved;
  }
}

function saveAdditionalStyles() {
  const value = document.getElementById('additionalStyles').value.trim();
  localStorage.setItem('additional_styles', value);
}

function loadSavedCustomStructure() {
  const saved = localStorage.getItem('custom_structure');
  if (saved) {
    document.getElementById('customStructure').value = saved;
  }
}

function saveCustomStructure(value) {
  localStorage.setItem('custom_structure', value);
}

function handleStructureChange() {
  const value = document.getElementById('structure').value;
  const customInput = document.getElementById('customStructure');
  if (value === 'custom') {
    customInput.style.display = 'block';
    customInput.focus();
  } else {
    customInput.style.display = 'none';
  }
}

async function handleApiKeyChange() {
  const apiKey = document.getElementById('apiKey').value.trim();
  if (!apiKey) {
    document.getElementById('modelSelector').innerHTML = '<option value="">Enter API key first</option>';
    document.getElementById('modelSelector').disabled = true;
    availableModels = [];
    modelsLoaded = false;
    return;
  }
  saveApiKey(apiKey);
  await fetchModels(apiKey);
}

async function fetchModels(apiKey) {
  const statusEl = document.getElementById('modelStatus');
  const selector = document.getElementById('modelSelector');
  
  statusEl.textContent = 'Loading models...';
  statusEl.className = 'model-status loading';
  selector.disabled = true;
  selector.innerHTML = '<option value="">Loading models...</option>';

  try {
    const result = await window.electronAPI.fetchModels(apiKey);
    if (!result.success) {
      throw new Error(result.error);
    }

    availableModels = result.data;
    modelsLoaded = true;

    selector.innerHTML = '';
    for (const model of availableModels) {
      const option = document.createElement('option');
      option.value = model.id;
      option.textContent = model.name;
      selector.appendChild(option);
    }

    const savedModel = localStorage.getItem('selected_model');
    if (savedModel && availableModels.some(m => m.id === savedModel)) {
      selector.value = savedModel;
    }

    selector.disabled = false;
    statusEl.textContent = `${availableModels.length} models loaded`;
    statusEl.className = 'model-status success';
  } catch (error) {
    statusEl.textContent = `Error: ${error.message}`;
    statusEl.className = 'model-status error';
    selector.innerHTML = '<option value="">Failed to load models</option>';
    availableModels = [];
    modelsLoaded = false;
  }
}

function handleModelChange() {
  const selectedModel = document.getElementById('modelSelector').value;
  localStorage.setItem('selected_model', selectedModel);
}

function generateStyleBlock(genre, additionalStyles) {
  const config = GENRE_CONFIGS[genre] || GENRE_CONFIGS['pop'];
  let style = `[${genre}, ${config.feel}, ${config.tempo}, ${config.production}, ${config.vocals}`;
  if (additionalStyles) {
    style += `, ${additionalStyles}`;
  }
  style += ']';
  return style;
}

function getStructureDescription() {
  const value = document.getElementById('structure').value;
  if (value === 'custom') {
    const custom = document.getElementById('customStructure').value.trim();
    if (custom) {
      saveCustomStructure(custom);
      return `Custom structure: ${custom}`;
    }
    return 'Custom structure (user-defined)';
  }
  return STRUCTURE_LABELS[value] || value;
}

async function handleGenerate() {
  const apiKey = document.getElementById('apiKey').value.trim();
  const modelId = document.getElementById('modelSelector').value;
  const prompt = document.getElementById('promptInput').value.trim();
  const genre = document.getElementById('genre').value;
  const additionalStyles = document.getElementById('additionalStyles').value.trim();

  if (!apiKey) {
    alert('Please enter your OpenRouter API key');
    return;
  }

  if (!modelId) {
    alert('Please select a model');
    return;
  }

  if (!prompt) {
    alert('Please enter a prompt describing the lyrics you want');
    return;
  }

  currentPrompt = prompt;

  const loadingState = document.getElementById('loadingState');
  const errorState = document.getElementById('errorState');
  const outputSection = document.getElementById('outputSection');
  const emptyOutput = document.getElementById('emptyOutput');

  loadingState.style.display = 'block';
  errorState.style.display = 'none';
  outputSection.style.display = 'none';
  emptyOutput.style.display = 'none';

  const structureHint = getStructureDescription();
  const enhancedPrompt = `${prompt}\n\nGenre: ${genre}\nStructure: ${structureHint}`;

  try {
    const messages = [
      { role: 'system', content: DEFAULT_SYSTEM_PROMPT },
      { role: 'user', content: enhancedPrompt }
    ];

    const result = await window.electronAPI.sendChatMessage(apiKey, modelId, messages);
    
    if (!result.success) {
      throw new Error(result.error);
    }

    const lyrics = result.data.choices[0].message.content.trim();
    currentLyrics = lyrics;
    currentStyle = generateStyleBlock(genre, additionalStyles);

    loadingState.style.display = 'none';
    displayOutput(currentStyle, lyrics);
    document.getElementById('saveBtn').disabled = false;
  } catch (error) {
    loadingState.style.display = 'none';
    errorState.style.display = 'block';
    document.getElementById('errorMessage').textContent = error.message;
  }
}

function displayOutput(style, lyrics) {
  document.getElementById('emptyOutput').style.display = 'none';
  document.getElementById('outputSection').style.display = 'block';
  document.getElementById('styleContent').textContent = style;
  document.getElementById('lyricsContent').textContent = lyrics;
}

function handleCopy(event) {
  const block = event.target.dataset.block;
  let text = '';

  if (block === 'style' && currentStyle) {
    text = currentStyle;
  } else if (block === 'lyrics' && currentLyrics) {
    text = currentLyrics;
  }

  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    const btn = event.target;
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 2000);
  });
}

async function handleSave() {
  if (!currentLyrics || !currentPrompt) {
    alert('Generate lyrics first before saving');
    return;
  }

  const genre = document.getElementById('genre').value;
  const structure = document.getElementById('structure').value;
  const customStructure = structure === 'custom' ? document.getElementById('customStructure').value.trim() : '';
  const additionalStyles = document.getElementById('additionalStyles').value.trim();

  const data = {
    id: `gen_${Date.now()}`,
    createdAt: new Date().toISOString(),
    inputs: { prompt: currentPrompt, genre, structure, customStructure, additionalStyles },
    output: { lyrics: currentLyrics, style: currentStyle },
    diagnostic: { scores: {}, totalScore: 0, passed: true },
  };

  try {
    const result = await window.electronAPI.saveGeneration(data);
    if (result.success) {
      loadHistory();
    } else {
      alert('Failed to save: ' + (result.error || 'Unknown error'));
    }
  } catch (err) {
    alert('Failed to save: ' + err.message);
  }
}

async function loadHistory() {
  const result = await window.electronAPI.listGenerations();
  const historyList = document.getElementById('historyList');

  if (!result.success || result.data.length === 0) {
    historyList.innerHTML = '<p class="empty-state">No saved generations yet</p>';
    return;
  }

  historyList.innerHTML = '';

  for (const gen of result.data) {
    const item = document.createElement('div');
    item.className = 'history-item';
    const customTitle = gen.inputs?.customTitle;
    const promptTitle = gen.inputs?.prompt?.slice(0, 30) || 'Untitled';
    const title = customTitle || promptTitle;
    const genreLabel = gen.inputs?.genre ? ` (${gen.inputs.genre})` : '';
    const displayTitle = customTitle ? title : (title + (gen.inputs?.prompt?.length > 30 ? '...' : ''));
    item.innerHTML = `
      <div class="history-item-content">
        <div class="history-item-title" data-id="${gen.id}">${displayTitle}${genreLabel}</div>
        <div class="history-item-date">${new Date(gen.createdAt).toLocaleDateString()}</div>
      </div>
      <div class="history-item-actions">
        <button class="rename-btn" data-id="${gen.id}" title="Rename">✎</button>
        <button class="delete-btn" data-id="${gen.id}" title="Delete">✕</button>
      </div>
    `;

    item.querySelector('.history-item-title').addEventListener('click', () => {
      loadGeneration(gen.id);
    });

    item.querySelector('.rename-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      openRenameModal(gen.id, customTitle || promptTitle);
    });

    item.querySelector('.delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteGeneration(gen.id);
    });

    historyList.appendChild(item);
  }
}

function openRenameModal(id, currentTitle) {
  renameTargetId = id;
  document.getElementById('renameInput').value = currentTitle;
  document.getElementById('renameModal').style.display = 'flex';
  document.getElementById('renameInput').focus();
  document.getElementById('renameInput').select();
}

function closeRenameModal() {
  document.getElementById('renameModal').style.display = 'none';
  renameTargetId = null;
}

async function confirmRename() {
  if (!renameTargetId) return;
  
  const newTitle = document.getElementById('renameInput').value.trim();
  if (!newTitle) return;

  const result = await window.electronAPI.loadGeneration(renameTargetId);
  if (!result.success) {
    closeRenameModal();
    return;
  }

  const gen = result.data;
  gen.inputs = gen.inputs || {};
  gen.inputs.customTitle = newTitle;

  const saveData = {
    id: gen.id,
    createdAt: gen.createdAt,
    inputs: gen.inputs,
    output: gen.output,
    diagnostic: gen.diagnostic || { scores: {}, totalScore: 0, passed: true },
  };

  const saveResult = await window.electronAPI.saveGeneration(saveData);
  closeRenameModal();
  if (saveResult.success) {
    loadHistory();
  }
}

async function loadGeneration(id) {
  const result = await window.electronAPI.loadGeneration(id);
  if (result.success) {
    const gen = result.data;
    currentLyrics = gen.output?.lyrics || '';
    currentStyle = gen.output?.style || '';
    currentPrompt = gen.inputs?.prompt || '';

    document.getElementById('promptInput').value = currentPrompt;
    if (gen.inputs?.genre) {
      document.getElementById('genre').value = gen.inputs.genre;
    }
    if (gen.inputs?.structure) {
      document.getElementById('structure').value = gen.inputs.structure;
      if (gen.inputs.structure === 'custom' && gen.inputs?.customStructure) {
        document.getElementById('customStructure').value = gen.inputs.customStructure;
        document.getElementById('customStructure').style.display = 'block';
      } else {
        document.getElementById('customStructure').style.display = 'none';
      }
    }
    if (gen.inputs?.additionalStyles) {
      document.getElementById('additionalStyles').value = gen.inputs.additionalStyles;
    }
    displayOutput(currentStyle, currentLyrics);
    document.getElementById('saveBtn').disabled = false;
  }
}

async function deleteGeneration(id) {
  if (!confirm('Delete this generation?')) return;

  const result = await window.electronAPI.deleteGeneration(id);
  if (result.success) {
    loadHistory();
  }
}