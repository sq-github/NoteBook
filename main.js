// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')


//创造窗口的类
class AppWindow extends BrowserWindow {
  constructor(config, fileLocation) {
    const basicConfig = {
      width: 300,
      height: 500,
      frame: false,
      transparent: true,
      resizable: false,
      maximizable:false,
      // resizable: false,
      // show: false,
      // alwaysOnTop: true,
      webPreferences: {
        nodeIntegration: true
      }
    }
    const finalConfig = { ...basicConfig, ...config }
    super(finalConfig)
    this.loadFile(fileLocation)
    // this.once('ready-to-show',()=>{
    //   this.show()
    // })
  }
}
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  // mainWindow = new BrowserWindow({
  //   width: 500,
  //   height: 800,
  //   webPreferences: {
  //     preload: path.join(__dirname, 'preload.js')
  //   }
  // })
  mainWindow = new AppWindow({}, './renderer/home/index.html')
  mainWindow.webContents.on('did-finish-load', function () {
    mainWindow.webContents.send('mainWin-open');
  });
  // and load the index.html of the app.
  // mainWindow.loadFile('index.html')

  //刷新窗口
  // ipcMain.on('ref-win', () => {
  //   let contents = mainWindow.webContents;
  //   contents.reload();
  // })
  //关闭窗口
  ipcMain.on('close-main', () => {
    mainWindow.close();
  })
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

//添加文本的窗口
var addWindow
//接收添加按钮的信息
ipcMain.on('add-plan', () => {
  addWindow = new AppWindow({}, ('./renderer/addPage/add.html'))
  //加载事件
  addWindow.webContents.on('did-finish-load', function () {
  addWindow.webContents.send('addWin-open');
  });
    // addWindow.webContents.openDevTools()
})
//关闭窗口
ipcMain.on('close-add', () => {
  mainWindow.webContents.send('win-closed');
  addWindow.close();
})

//聚焦窗口
ipcMain.on('focus-win', () => {
  let contents = addWindow.webContents;
  contents.focus();
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

