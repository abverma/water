const {MongoClient} = require('mongodb')
const {log, error} = require('./customLogger')
const EventEmitter = require('eventemitter3')

const {DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env

let uri
if (DB_HOST == 'localhost') {
	uri = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}?retryWrites=true&w=majority&connectTimeoutMS=300000`
} else {
	uri = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?retryWrites=true&w=majority&connectTimeoutMS=300000`
}
const client = new MongoClient(uri, { useUnifiedTopology: true })

// client.on('connectionPoolCreated', event => console.dir(event));
// client.on('connectionPoolClosed', event => console.dir(event));
// client.on('connectionCreated', event => console.dir(event));
// client.on('connectionReady', event => console.dir(event));
// client.on('connectionClosed', event => console.dir(event));
// client.on('connectionCheckOutStarted', event => console.dir(event));
// client.on('connectionCheckOutFailed', event => console.dir(event));
// client.on('connectionCheckedOut', event => console.dir(event));
// client.on('connectionCheckedIn', event => console.dir(event));
// client.on('connectionPoolCleared', event => console.dir(event));

exports.connect = (callback) => {

		client.connect(err => {
			if (err) {
				error(err)
				if (callback) {
					return callback(err)
				} else {
					return Promise.reject(err)
				}
			}

			log('Connection successful!')

			if (callback) {
				return callback(null, client.db(DB_NAME))
			} else {
				return Promise.resolve(client.db(DB_NAME))
			}
			
		})
	
}

exports.close = () => {
	client.close()
		.then(() => {
			log('Connection closed!')
		})
		.catch((err) => {
			error(err)
			error('Error in closing connection!')
		})
}
