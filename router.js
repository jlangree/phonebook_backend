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
router.post('/api/persons', async (req, res, next) => {
  const body = req.body
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
    next(err)
  }
})

// update resource
router.put('/api/persons/:id', async (req, res) => {
  const { name, number } = req.body
  const { id } = req.params
  // validation - make sure name and number are not null; make sure name is not already saved
  if (!name || !number) {
    return res.status(400).json({error: 'missing name or number'})
  }
  const filter = { _id: id }  // find by id
  const update = { name, number }  // new person object
  const opts = { new: true, runValidators: true }  // options to run validators and return updated object instead of old one
  const updatedContact = await Person.findOneAndUpdate(filter, update, opts)
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