const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');
const { spawn, exec } = require('child_process');

let jwt = null;
let mainWindow;


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Only if you need it
      contextIsolation: false // Only if you need it
    }
  });

  // Load your frontend (change as needed)
  mainWindow.loadFile('index.html');
  // Or, if using a dev server:
  // mainWindow.loadURL('http://localhost:3000');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}
ipcMain.on('redirect-to-session', () => {
  const sessionWin = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  sessionWin.loadFile('session.html');
});

function showCheckoutReminder() {
  const popup = new BrowserWindow({
    width: 600,
    height: 400,
    alwaysOnTop: true,
    frame: false,
    transparent: true
  });

  popup.loadFile('reminder.html');
  setTimeout(() => popup.close(), 30000);
}

function trackSession() {
  if (!jwt) return;

  setInterval(async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/session/active', {
        headers: { Authorization: `Bearer ${jwt}` }
      });

      const sessionStartTime = new Date(response.data.startTime);
      const now = new Date();
      const diffHours = (now - sessionStartTime) / (1000 * 60 * 60);

      if (diffHours >= 8) {
        showCheckoutReminder();
      }
    } catch (err) {
      console.log("No active session or error:", err.message);
    }
  }, 60 * 1000);
}

ipcMain.on('token', (event, token) => {
  jwt = token;
  console.log('Token received in main:', jwt);
  trackSession();
});

// ✅ Add this:
ipcMain.on('send-token', (event) => {
  console.log('[Main] Renderer requested token');
  event.sender.send('send-token', jwt);
});


ipcMain.handle('session-start', async () => {
  console.log('Session started!');
  try {
    await axios.post('http://localhost:4000/api/session/start', {}, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
  } catch (error) {
    console.error('Failed to start session:', error.message);
  }
});

ipcMain.handle('session-end', async () => {
  console.log('Session ended!');
  try {
    await axios.post('http://localhost:4000/api/session/end', {}, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
  } catch (error) {
    console.error('Failed to end session:', error.message);
  }
});

ipcMain.handle('break-start', async () => {
  console.log('Break started!');
  try {
    await axios.post('http://localhost:4000/api/session/break/start', {}, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
  } catch (error) {
    console.error('Failed to start break:', error.message);
  }
});

ipcMain.handle('break-end', async () => {
  console.log('Break ended!');
  try {
    await axios.post('http://localhost:4000/api/session/break/end', {}, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
  } catch (error) {
    console.error('Failed to end break:', error.message);
  }
});


app.whenReady().then(() => {
  // 🟢 Start backend Node server (assumes backend has a start script)
  // exec('npm run start-backend', (err, stdout, stderr) => {
  //   if (err) console.error('Backend failed to start:', err);
  //   else console.log('Backend running...');
  // });

  createWindow();
});
