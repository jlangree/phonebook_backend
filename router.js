const express = require('express')
const Person = require('./models/person')

const router = express.Router()

// route to display info
router.get('/info', async (req, res) => {
  try {
    const persons = await Person.find({})
    const info = `The number of contacts in the phonebook is ${persons.length}.`
    const timeString = new Date().toString()
    res.send(
      `<p>${info}</p>
      <p>${timeString}</p>`
    )
  } catch (err) {
    console.error(err.message)
    next(err)
  }
})

// fetch all resources
router.get('/api/persons', async (req, res) => {
  const allPersons = await Person.find({})
  res.json(allPersons)
})

// fetch individual resource
router.get('/api/persons/:id', async (req, res, next) => {
  try {
    const contact = await Person.findById(req.params.id)
    if (contact) {
      res.json(contact)
    } else {
      res.status(404).end()
    }
  } catch (err) {
    next(err)
  }
})

// post new resource
router.post('/api/persons', async (req, res) => {
  const body = req.body
  // validation - make sure name and number are not null; make sure name is not already saved
  if (!body.name || !body.number) {
    return res.status(400).json({error: 'missing name or number'})
  }
  // if ( persons.map(p => p.name).includes(body.name) ) {
  //   return res.status(400).json({error: 'name must be unique'})
  // }
  // save posted data as newContact object
  const newContact = new Person({
    name: body.name,
    number: body.number
  })
  // save to db
  try{
    const savedContact = await newContact.save()
    res.json(savedContact)
  } catch (err) {
    res.status(500).json({error: err.message})
  }
})

// update resource
router.put('/api/persons/:id', async (req, res) => {
  const body = req.body
  // validation - make sure name and number are not null; make sure name is not already saved
  if (!body.name || !body.number) {
    return res.status(400).json({error: 'missing name or number'})
  }
  const updatedContact = await Person.findByIdAndUpdate(req.params.id, body)
  res.json(updatedContact)
})

// delete a resource by id
router.delete('/api/persons/:id', async (req, res, next) => {
  try {
    const result = await Person.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

module.exports = router