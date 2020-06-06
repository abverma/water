const {MongoClient, ObjectID} = require('mongodb')
const {logger, log, error} = require('./customLogger')
const {
	DB_USERNAME, 
	DB_PASSWORD, 
	DB_HOST, 
	DB_PORT, 
	DB_NAME, 
	LOG_LEVEL } = process.env

let uri

if (DB_HOST == 'localhost' || DB_HOST == '0.0.0.0') {
	uri = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}?retryWrites=true&w=majority&connectTimeoutMS=300000`
} else {
	uri = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?retryWrites=true&w=majority&connectTimeoutMS=300000`
}

const client = new MongoClient(uri, { 
	useUnifiedTopology: true,
	loggerLevel: LOG_LEVEL,
	logger: log 
})

let db = null 

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
			db = client.db(DB_NAME)

			if (callback) {
				return callback(null, db)
			} else {
				return Promise.resolve(db)
			}
			
		})
	
}

exports.getDb = () => {
	return db
}

exports.getUri = () => {
	return uri
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

exports.findIntake = (query, userId) => {
	query['user_id'] = ObjectID(userId)

	return db.collection('intake').findOne(query)
}

exports.updateIntake = (intake, userId) => {
	return db.collection('intake').updateOne({
		date: intake.date.split('T')[0],
		user_id: ObjectID(userId)
	}, {
		$set: {
			intake: intake.intake
		}
	}, {
		upsert:true
	})
}
