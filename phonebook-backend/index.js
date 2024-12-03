require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

// use morgan middleware for logging
morgan.token('post-body', (req) => JSON.stringify(req.body))
// use tiny config for non-POST requests
app.use(morgan('tiny', {
  skip: (req) => req.method === 'POST'
}))
// include request body for POST requests
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :post-body',
  { skip: (req) => req.method !== 'POST' }
))


app.get('/', (_req, res) => {
  res.send('<h1>Hello Phonebook backend</h1>')
})

// create info page
app.get('/info', (_req, res) => {
  Person.find({}).then(persons => {
    const length = persons.length
    const output = `
            <p>Phonebook has info for ${length} ${length !== 1 ? 'people' : 'person'}</p>
            <p>${Date()}</p>
        `
    res.send(output)
  })
})

// get all phonebook entries
app.get('/api/persons', (_req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

// get a phonebook entry by id
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
    .catch(error => next(error))
})

// delete a phonebook entry by id
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(personRemoved => {
      res.json(personRemoved)
    })
    .catch(error => next(error))

})

// create a phonebook entry
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))

})

// update an existing phonebook entry by id
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, _req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})