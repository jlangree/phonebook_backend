const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const config = require('../config')

mongoose
  .set('useFindAndModify', false)
  .set('useNewUrlParser', true)
  .set('useCreateIndex', true)
  .set('useUnifiedTopology', true)

const url = `mongodb+srv://${config.dbUser}:${config.dbPassword}@cluster0.ggnbw.mongodb.net/${config.dbName}?retryWrites=true&w=majority`

async function connectMongo(url) {
  console.log('connecting to ', url)
  try {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log('connected to MongoDB')
  } catch (err) {
    console.log('error connecting to MongoDB: ', err.message)
  }
}

connectMongo(url)

// Define schema
const personSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, required: true, unique: true },
  number: { type: String, minlength: 7, required: true }
})

// Apply uniqueValidator plugin to personSchema
personSchema.plugin(uniqueValidator)

// set 'toJSON' to remove '__v' and replace '_id' object with 'id' string
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)