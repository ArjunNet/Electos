const date = new Date()

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getCurrentDate() {
	let currDate = `${date.getDay()}|${date.getMonth()}|${date.getFullYear()}`

	console.log(currDate)

	return currDate
}

function getCurrentTime() {
	let currTime = `${date.getHours()}:${date.getMinutes()}` // Fix Minutes converting to only one digit.

	console.log(currTime)

	return currTime
}

function activeTasksCount() {
	let count = 0

	while(true) {
		let currTask = localStorage.getItem(`task${count + 1}`)

		if(currTask == null || currTask == "") break
		
		count++
	}

	return count
}

async function setTasks() {
	let tasksBox = document.getElementById("tasksDiv")

	let tasksCount = activeTasksCount()

	for(let i = 0; i < tasksCount; i++) {
		let task = JSON.parse(localStorage.getItem(`task${i + 1}`))
		console.log(task)
		
		let taskBox = document.createElement("div")
		taskBox.className = "taskDiv"

		let delTaskBtn = document.createElement("button")
		delTaskBtn.setAttribute("onclick", `deleteTask(${i + 1})`)
		delTaskBtn.innerText = "✔️"
		delTaskBtn.className = "taskDeleteBtn"
		taskBox.appendChild(delTaskBtn)

		let editTaskBtn = document.createElement("button")
		editTaskBtn.setAttribute("onclick", `editTask(${i + 1})`)
		editTaskBtn.innerText = "edit"
		editTaskBtn.className = "taskEditBtn"
		taskBox.appendChild(editTaskBtn)

		let divider = document.createElement("hr")
		divider.className = "taskMenuDivider"
		taskBox.appendChild(divider)

		let taskMsg = document.createElement("h2")
		taskMsg.innerText = task.taskContent	
		taskBox.appendChild(taskMsg)

		// let taskDate = document.createElement("p")
		// taskDate.innerText = task.taskDate
		// taskBox.appendChild(taskDate)

		// let taskTime = document.createElement("p")
		// taskTime.innerText = task.taskTime
		// taskBox.appendChild(taskTime)

		tasksBox.appendChild(taskBox)
	}
}

async function addTaskPopup() {
	let popupFrame = document.createElement("iframe")
	popupFrame.setAttribute("src", "addTask.html")
	popupFrame.setAttribute("title", "New Task Popup")
	popupFrame.className = "addTaskPopup"
	document.body.appendChild(popupFrame)

	let bgFunctionalityLimiterFrame = document.createElement("iframe")
	bgFunctionalityLimiterFrame.className = "bgFunctionalityLimiterFrame"
	document.body.appendChild(bgFunctionalityLimiterFrame)

	await sleep(500)

	let popupFrameCloseBtn = popupFrame.contentWindow.document.getElementById("addTaskPopupCloseBtn")

	popupFrameCloseBtn.disabled = false

	popupFrameCloseBtn.onclick = closePopup

	function closePopup() {
		popupFrame.remove()
		bgFunctionalityLimiterFrame.remove()
	}
} 

async function addTask() {
	tasksCount = activeTasksCount()

	let newTask = {
		"taskContent": document.getElementById("taskContentInput").value,
		"taskDate": document.getElementById("taskEndDateTimeInput").value,
		"taskImportant": document.getElementById("taskImpCheckInput").value
	}

	console.info({newTask})	

	// let newTask = {
	// 	"taskContent": (document.getElementById("addTaskInput")).value,
	// 	"taskDate": await getCurrentDate(),
	// 	"taskTime": await getCurrentTime()
	// }

	// localStorage.setItem(`task${tasksCount + 1}`, JSON.stringify(newTask))	

	// console.log(newTask)
}

document.getElementById("addTaskButton").onclick = addTaskPopup

setTasks()
