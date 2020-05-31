
let todaysIntake = 0
let currentHeight = 0
let currDate = new Date()
const dailyTarget = 4
const totalHeight = 500
const congratulation = document.getElementsByClassName('congratulation')[0]
const jug = document.querySelector('.water')
const btns = document.getElementsByTagName('button')
const targetStatField = document.querySelector('#target')
const intakeStatField = document.querySelector('#intake')
const dateStatField = document.querySelector('#curdate')
const dateField = document.querySelector('#date')

jug.addEventListener('transitionend', () => {
	if (currentHeight >= 500) {
		if (currDate.toDateString().split('T')[0] == (new Date()).toDateString().split('T')[0])
		congratulation.style.display = 'block'
	}
})

document.onload = start()

function start() {
	congratulation.style.display = 'none'
	disableBtns(false)
	if (targetStatField) {
		targetStatField.innerHTML = dailyTarget
	}

	if (intakeStatField) {
		intakeStatField.innerHTML = todaysIntake
	}

	if (dateStatField) {
		dateStatField.innerHTML = currDate.toDateString()
	}

	if (dateField) {
		dateField.value = currDate.toISOString().split('T')[0]
	}
	fetchIntake(currDate.toISOString().split('T')[0])
}

function changeDate(el) {
	currDate = new Date(el.value)
	console.log(currDate)
	start()
}

function fill (el, value) {
	
	value = el.value
	console.log(value)

	if (value == '0') {
		todaysIntake = 0
	} else {
		todaysIntake += parseFloat(value)
	}
	
	fillUpto(todaysIntake)

	updateIntake(todaysIntake)
}

function fillUpto(todaysIntake) {
	if (todaysIntake != 0) {
		currentHeight = ((totalHeight / dailyTarget) * todaysIntake).toFixed(2)

		console.log('Setting glass height to : ' + currentHeight)

		if (currentHeight >= 500) {
			currentHeight = 500
			disableBtns(true)
		}
	} else {
		currentHeight = 0
		todaysIntake = 0

		Object.keys(btns).forEach((key) => {
			if (btns[key].value != '0') {
				btns[key].disabled = false
			}
		})
	}
	
	if (intakeStatField) {
		intakeStatField.innerHTML = todaysIntake
	}

	jug.style.height = currentHeight + 'px'
}

function updateIntake (intake) {
	fetch('/intake', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=utf-8'
		},
		body:JSON.stringify({
			date: currDate,
			intake: intake
		})
	})
	.then((res) => {
		return res.json()
	})
	.then((res) => {
		console.log(res)
	})
	.catch((err) => {
		console.log(err)
	})
}

function fetchIntake (date) {
	fetch('/intake?date=' + date) 
	.then((res) => {
		return res.json()
	})
	.then((res) => {
		todaysIntake = res.data.length ? res.data[0].intake : 0
		fillUpto(todaysIntake)
	})
	.catch((err) => {
		console.log(err)
	})
}

function disableBtns(flag) {
	Object.keys(btns).forEach((key) => {
		if (btns[key].value != '0') {
			btns[key].disabled = flag
		}
	})
}
