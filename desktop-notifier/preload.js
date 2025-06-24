const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  redirectToSession: () => ipcRenderer.send('redirect-to-session'),
  sendToken: (token) => ipcRenderer.send('send-token', token),
  onReceiveToken: (callback) => ipcRenderer.on('send-token', callback),
  startSession: () => ipcRenderer.invoke('session-start'),
  endSession: () => ipcRenderer.invoke('session-end'),
  startBreak: () => ipcRenderer.invoke('break-start'),
  endBreak: () => ipcRenderer.invoke('break-end'),
});

