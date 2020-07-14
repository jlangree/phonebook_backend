const mongoose = require('mongoose')
const config = require('./config')

// if (process.argv.length < 3) {
//   console.log('Please provide the password as an argument: node mongo.js <password>')
//   process.exit(1)
// }

const url = `mongodb+srv://${config.dbUser}:${config.dbPassword}@cluster0.ggnbw.mongodb.net/${config.dbName}?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: 'Gilboondrus Jokersly',
  number: '562-487-7778'
})

async function saveDocument(doc) {
  const result = await doc.save()
  console.log('note saved')
  console.log(result)
  mongoose.connection.close()
}

// saveDocument(person)

Person.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})