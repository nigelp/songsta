const { app, BrowserWindow, ipcMain, clipboard } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const { fetchAvailableModels, sendMessage } = require('./utils/api');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const GENERATIONS_DIR = path.join(app.getPath('userData'), 'generations');

async function ensureGenerationsDir() {
  try {
    await fs.mkdir(GENERATIONS_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create generations directory:', err);
  }
}

ipcMain.handle('save-generation', async (event, data) => {
  await ensureGenerationsDir();
  const id = data.id || `gen_${Date.now()}`;
  const filePath = path.join(GENERATIONS_DIR, `${id}.json`);
  const saveData = {
    id,
    createdAt: data.createdAt || new Date().toISOString(),
    inputs: data.inputs,
    output: data.output,
    diagnostic: data.diagnostic,
  };
  await fs.writeFile(filePath, JSON.stringify(saveData, null, 2));
  return { success: true, id };
});

ipcMain.handle('load-generation', async (event, id) => {
  await ensureGenerationsDir();
  const filePath = path.join(GENERATIONS_DIR, `${id}.json`);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return { success: true, data: JSON.parse(data) };
  } catch (err) {
    return { success: false, error: 'Generation not found' };
  }
});

ipcMain.handle('list-generations', async () => {
  await ensureGenerationsDir();
  try {
    const files = await fs.readdir(GENERATIONS_DIR);
    const generations = [];
    for (const file of files.filter(f => f.endsWith('.json'))) {
      const filePath = path.join(GENERATIONS_DIR, file);
      const data = await fs.readFile(filePath, 'utf-8');
      generations.push(JSON.parse(data));
    }
    generations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { success: true, data: generations };
  } catch (err) {
    return { success: true, data: [] };
  }
});

ipcMain.handle('delete-generation', async (event, id) => {
  await ensureGenerationsDir();
  const filePath = path.join(GENERATIONS_DIR, `${id}.json`);
  try {
    await fs.unlink(filePath);
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Failed to delete' };
  }
});

ipcMain.handle('copy-to-clipboard', async (event, text) => {
  clipboard.writeText(text);
  return { success: true };
});

ipcMain.handle('openrouter-fetch-models', async (event, apiKey) => {
  try {
    const models = await fetchAvailableModels(apiKey);
    return { success: true, data: models };
  } catch (err) {
    console.error('OpenRouter fetch models error:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('openrouter-send-message', async (event, apiKey, modelId, messages) => {
  try {
    const response = await sendMessage(apiKey, modelId, messages);
    return { success: true, data: response };
  } catch (err) {
    console.error('OpenRouter send message error:', err);
    return { success: false, error: err.message };
  }
});