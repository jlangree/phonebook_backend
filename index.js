const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const router = require('./router')

// morgan logger
morgan.token( 'body', (req, res) =>
  req.method === 'POST' || 'PUT'
    ? JSON.stringify(req.body)
    : null
)

// error handler
const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

// handle requests to unknown endpoints
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const app = express()

// Middleware
app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// API Routes
app.use(router)


app.use(unknownEndpoint)
app.use(errorHandler)

// listen on PORT
const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server started on PORT ${port}`)
})
