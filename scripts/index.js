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

async function deleteTask(taskNum) {
	let audioBox = document.createElement("audio")
	audioBox.setAttribute("src", "../media/checkSound.wav")
	audioBox.play()

	let tasksCount = activeTasksCount()

	console.log(tasksCount)

	for(let i = taskNum; i < tasksCount; i++) localStorage.setItem(`task${i}`, localStorage.getItem(`task${i + 1}`))
	
	localStorage.removeItem(`task${tasksCount}`)

	let taskBox = document.getElementById(`task${taskNum}`)

	taskBox.style.transform = "rotate(+10deg)"
	await sleep(110)
	taskBox.style.transform = "rotate(-10deg)"
	await sleep(110)
	taskBox.style.transform = "rotate(0deg)"
	await sleep(25)

	taskBox.style.transition = "0.5s"
	await sleep(50)
	taskBox.style.opacity = "0"
	await sleep(525)
	taskBox.remove()
	await sleep(50)
}

async function setTask(task, i) {
	let tasksBox = document.getElementById("tasksDiv")

	let taskBox = document.createElement("div")
	taskBox.className = "taskDiv"
	taskBox.id = `task${i + 1}`

	if(task.taskEndTime != "" && task.taskEndDate != "") {
		let dateTimeDiv = document.createElement("div")
		dateTimeDiv.className = "dateTimeDiv"
		let date = task.taskEndDate
		let time = task.taskEndTime
	
		let dateTimeStatement = `Finish before ${time} on ${date}`
		dateTimeText = document.createElement("p")
		dateTimeText.innerText = dateTimeStatement
		dateTimeText.className = "dateTimeText"
		dateTimeDiv.appendChild(dateTimeText)
		
		taskBox.appendChild(dateTimeDiv)
	}

	let taskMsg = document.createElement("h2")
	taskMsg.innerText = task.taskContent	
	taskBox.appendChild(taskMsg)

	let taskFunctionsDiv = document.createElement("div")
	taskFunctionsDiv.className = "taskFunctionsDiv"

	let delTaskBtn = document.createElement("button")
	delTaskBtn.setAttribute("onclick", `deleteTask(${i + 1})`)
	delTaskBtn.innerText = "Done"
	delTaskBtn.className = "taskDeleteBtn"
	taskFunctionsDiv.appendChild(delTaskBtn)

	let editTaskBtn = document.createElement("button")
	editTaskBtn.setAttribute("onclick", `editTask(${i + 1})`)
	editTaskBtn.innerText = "Edit"
	editTaskBtn.className = "taskEditBtn"
	taskFunctionsDiv.appendChild(editTaskBtn)

	taskBox.appendChild(taskFunctionsDiv)

	// if(task.taskImportant == true) {
	// 	taskBox.className = "importantTaskBox"
	// }

	tasksBox.appendChild(taskBox)
}

async function setTasks() {
	let tasksCount = activeTasksCount()

	for(let i = 0; i < tasksCount; i++) {
		let task = JSON.parse(localStorage.getItem(`task${i + 1}`))
		console.log(task)

		setTask(task, i)
	}
}

async function addTaskPopup() {
	const popupFrame = document.createElement("iframe")
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

	let addTaskBtn = popupFrame.contentWindow.document.getElementById("finalizeTaskBtn")
	addTaskBtn.onclick = addTask

	function closePopup() {
		popupFrame.remove()
		bgFunctionalityLimiterFrame.remove()
	}
} 

async function addTask() {
	console.log("adding a new task.")
	tasksCount = activeTasksCount()

	let popupFrameDoc = (document.getElementsByClassName("addTaskPopup")[0]).contentWindow.document

	let taskDate = ((popupFrameDoc.getElementById("taskEndDateTimeInput").value).split("T")[0]).replaceAll("-", "/")
	let taskTime = (popupFrameDoc.getElementById("taskEndDateTimeInput").value).split("T")[1]

	let newTask = {	
		"taskContent": popupFrameDoc.getElementById("taskContentInput").value,
		"taskEndDate": taskDate,
		"taskEndTime": taskTime,
		"taskImportant": popupFrameDoc.getElementById("taskImpCheckInput").checked	
	}

	console.info({newTask})

	localStorage.setItem(`task${tasksCount + 1}`, JSON.stringify(newTask))

	setTask(JSON.parse(localStorage.getItem(`task${tasksCount + 1}`)), (tasksCount))
}

document.getElementById("addTaskBtn").onclick = addTaskPopup

setTasks()
