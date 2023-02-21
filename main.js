const { ipcMain } = require("electron")

const app = require("electron").app

const BrowserWindow = require("electron").BrowserWindow


function createWindow() {
    const window = new BrowserWindow({
		frame: false,
		autoHideMenuBar: true,
		minHeight: 400,
		minWidth: 600,
        width: 1080,
        height: 800,
		webPreferences: {
			nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
		}
    })

    window.loadFile("views/index.html")

    return window
}

app.whenReady().then(function() {
    window = createWindow()

    app.on("activate", function() {
        if(BrowserWindow.getAllWindows().length == 0) createWindow()
    })

    app.on('window-all-closed', () => {
        if (process.platform !== "darwin") app.quit()
    })

	ipcMain.on("close", async function() {
		window.close()
	})	

	ipcMain.on("minimize", async function() {
		window.minimize()
	})
	
	ipcMain.on("maximize", async function() {
		console.log(window.isMaximized())
		if(window.isMaximized()) window.unmaximize()
		else window.maximize()
	})	
})


