const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveGeneration: (data) => ipcRenderer.invoke('save-generation', data),
  loadGeneration: (id) => ipcRenderer.invoke('load-generation', id),
  listGenerations: () => ipcRenderer.invoke('list-generations'),
  deleteGeneration: (id) => ipcRenderer.invoke('delete-generation', id),
  fetchModels: (apiKey) => ipcRenderer.invoke('openrouter-fetch-models', apiKey),
  sendChatMessage: (apiKey, modelId, messages) => ipcRenderer.invoke('openrouter-send-message', apiKey, modelId, messages),
});