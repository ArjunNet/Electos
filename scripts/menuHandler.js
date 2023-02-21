const { ipcRenderer } = require('electron')

document.getElementById("closeWindowButton").onclick = function() {
	ipcRenderer.send("close")
}

document.getElementById("minimizeWindowButton").onclick = function() {
	ipcRenderer.send("minimize")
}

document.getElementById("fullscreenWindowButton").onclick = function() {
	ipcRenderer.send("maximize")
}