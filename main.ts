const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 906,
    height: 629,
    resizable: false,
    center: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.ts')
    },
    autoHideMenuBar: true
  })
  win.loadFile('dist/index.html')
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
