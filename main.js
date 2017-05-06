const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow;
const {autoUpdater} = require("electron-updater");
const log = require('electron-log');
const path = require('path')
const url = require('url');

let mainWindow

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  });

  autoUpdater.setFeedURL({
    'provider': 'github',
    'owner': 'nbcnc',
    'repo': 'updater',
    'token': '29444d5e380e63ef21cb2e11423a5a7934bd1bf7'
  });

  autoUpdater.checkForUpdates();

}

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});

function sendStatusToWindow(text) {
  log.info(text);
  mainWindow.webContents.send('message', text);
}
autoUpdater.on('create-client', (data, token) => {
  console.log(data, token);
  sendStatusToWindow('client created...', data, token);
});
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});
autoUpdater.on('update-available', (ev, info) => {
  sendStatusToWindow('Update available.');
});
autoUpdater.on('update-not-available', (ev, info) => {
  sendStatusToWindow('Update not available.');
});
autoUpdater.on('error', (ev, err) => {
  sendStatusToWindow('Error in auto-updater.', ev, err);
});
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
});
autoUpdater.on('update-downloaded', (ev, info) => {
  setTimeout(function () {
    autoUpdater.quitAndInstall();
  }, 5000)
});
app.on('ready', createWindow)

