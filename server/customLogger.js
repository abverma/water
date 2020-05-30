const fs = require('fs')
const { Console } = require('console')

const output = fs.createWriteStream('./stdout.log')
const errorOutput = fs.createWriteStream('./stderr.log')

const customLogger = new Console({ stdout: output, stderr: errorOutput })

exports.log = (str) => {
	console.log(str)
	customLogger.log(str)
}

exports.error = (str) => {
	console.error(str)
	customLogger.error(str)
}

exports.logger = (req, res, next) => {
	this.log(`[${new Date().toUTCString()}] ${req.method} ${req.path} ${req.protocol}`)
	next()
}