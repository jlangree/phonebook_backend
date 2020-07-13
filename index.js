const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()



// Middleware
app.use(express.json())
app.use(express.static('build'))
app.use(cors())
// morgan logger
morgan.token( 'body', (req, res) =>
  req.method === 'POST' || 'PUT'
    ? JSON.stringify(req.body)
    : null
)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// route to display info
app.get('/info', (req, res) => {
  const info = `The number of contacts in the phonebook is ${persons.length}.`
  const timeString = new Date().toString()
  res.send(
    `<p>${info}</p>
    <p>${timeString}</p>`
  )
})

// API Routes
// ============================================================

// fetch all resources
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// fetch all resources
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const contact = persons.find(p => p.id ===id)
  console.log(contact)
  res.json(contact)
})

// post new resource
app.post('/api/persons', (req, res) => {
  const body = req.body
  // validation - make sure name and number are not null; make sure name is not already saved
  if (!body.name || !body.number) {
    return res.status(400).json({error: 'missing name or number'})
  }
  if ( persons.map(p => p.name).includes(body.name) ) {
    return res.status(400).json({error: 'name must be unique'})
  }
  // save posted data as newContact object
  const newContact = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 10000000000)
  }
  persons = persons.concat(newContact)
  res.json(newContact)
})

// update resource
app.put('/api/persons/:id', (req, res) => {
  const body = req.body
  // validation - make sure name and number are not null; make sure name is not already saved
  if (!body.name || !body.number) {
    return res.status(400).json({error: 'missing name or number'})
  }
  
  persons = persons.concat(body)
  res.json(body)
})

// delete a resource by id
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})


// listen on PORT
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`)
})

// Data
let persons = [
  { name: 'Shure Harkmeister', number: '234-135-6543', id: 2 },
  { name: 'Mootentootin Rudendood', number: '199-666-3433', id: 5 },
  { name: 'Gornly Dirkycunt', number: '144-244-3555', id: 3 },
  { name: 'Florp McCorkenbork', number: '144-522-6333', id: 4 },
  { name: 'Shorglu Halperstein', number: '355-444-3333', id: 6 },
  { name: 'Plonk Plinkness', number: '523-346-2352', id: 7 },
  { name: 'Styracky Blorfenclork', number: '456-888-1212', id: 8 },
  { name: 'Jackmarius Tacktheratrix', number: '321-123-4569', id: 9 },
  { name: 'Joobgrawl Plorp', number: '234-595-2343', id: 11 }
]
