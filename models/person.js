const mongoose = require('mongoose')
const config = require('../config')

mongoose.set('useFindAndModify', false)

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

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)