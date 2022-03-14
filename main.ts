const { app, BrowserWindow } = require('electron');
const path = require('path');

const isDev = process.env.IS_DEV == "true" ? true : false;

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    resizable: false,
    center: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.ts')
    },
    autoHideMenuBar: true,
    fullscreenable: true,
    useContentSize: true
  })

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, './dist/index.html')}`
  );

  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
})
