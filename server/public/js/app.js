
let todaysIntake = 0
let currentHeight = 0

const dailyTarget = 4
const totalHeight = 500
const congratulation = document.querySelector('.congratulation')
const jug = document.querySelector('.water')
const btns = document.getElementsByTagName('button')
const targetField = document.querySelector('#target')
const intakeField = document.querySelector('#intake')
const dateField = document.querySelector('#curdate')

if (targetField) {
	targetField.innerHTML = dailyTarget
}

if (intakeField) {
	intakeField.innerHTML = todaysIntake
}

if (dateField) {
	dateField.innerHTML = (new Date()).toDateString()
}

jug.addEventListener('transitionend', () => {
	if (currentHeight >= 500) {
		congratulation.hidden = false
	}
})

document.onload = fetchIntake((new Date()).toISOString().split('T')[0])

function fill (el, value) {
	
	value = el.value
	console.log(value)

	if (value == '0') {
		fillUpto(0)
	} else {
		todaysIntake += parseFloat(value)
		fillUpto(todaysIntake)
	}
	
	updateIntake(todaysIntake)
}

function fillUpto(todaysIntake) {
	if (todaysIntake != 0) {
		currentHeight = ((totalHeight / dailyTarget) * todaysIntake).toFixed(2)

		console.log('Setting glass height to : ' + currentHeight)

		if (currentHeight >= 500) {
			currentHeight = 500
			Object.keys(btns).forEach((key) => {
				if (btns[key].value != '0') {
					btns[key].disabled = true
				}
			})
		}
	} else {
		currentHeight = 0
		todaysIntake = 0
	}
	
	if (intakeField) {
		intakeField.innerHTML = todaysIntake
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
			date: new Date(),
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
		todaysIntake = res.data[0].intake
		fillUpto(todaysIntake)
	})
	.catch((err) => {
		console.log(err)
	})
}
