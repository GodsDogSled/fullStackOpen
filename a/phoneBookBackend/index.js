


// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }


const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
// app.use(requestLogger)
// app.use(morgan(function (tokens, req, res) {
//   return [
//     tokens.method(req, res),
//     tokens.url(req, res),
//     tokens.status(req, res),
//     tokens.res(req, res, 'content-length'), '-',
//     tokens['response-time'](req, res), 'ms',
//     req.body.json(),
//   ].join(' ')
// }))

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))





let contacts = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

const generateId = () => {
  // const maxId = notes.length > 0
  //   ? Math.max(...notes.map(n => n.id))
  //   : 0

  return Math.floor(Math.random() * 99999999);
}

app.get('/', (request, response) => {
  response.send('<h1>Hello Word!</h1>')
})

app.get('/api/contacts', (request, response) => {
  response.json(contacts)
})

app.get('/api/contacts/:id', (request, response) => {
  const id = Number(request.params.id)

  const contact = contacts.find(contact => contact.id === id)

  if (contact) {
    response.json(contact)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/contacts/:id', (request, response) => {
  const id = Number(request.params.id)
  contacts = contacts.filter(contact => contact.id !== id)

  response.status(204).end()
})

app.post('/api/contacts', (request, response) => {
  const body = request.body



  if (!body.name || !body.number) {
    return response.status(404).json({ error: "name or number is missing" })
  }

  if (contacts.find(contact => contact.name === body.name)) {
    return response.status(404).json({ error: "name is already in phonebook" })
  }


  const contact = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  contacts = contacts.concat(contact)
  response.json(contact)
})

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(
    `<p>Phonebook has ${contacts.length} contacts</p>
      
    <p>
      ${date}
    </p>`


  )
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})