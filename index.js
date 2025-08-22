const http = require('http')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
const bodyMorgan = (tokens, req, res) => {
  if(req.body) {
    return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
    ].join(' ')
  }
  
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
    ].join(' ')
} 
app.use(morgan(bodyMorgan))


let pb_entries = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// app.get('/', (request, response) => {
//   response.send('<h1>Hello World!</h1>')
// })

app.get('/api/persons', (request, response) => {
  response.json(pb_entries)
})

app.get('/info', (request, response) => {
    const numEntry = pb_entries.length
    const currentDate = new Date().toLocaleString();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    response.send(`
        <div>
            <div> Phonebook has info for ${numEntry} people </div>
            <div> ${currentDate} ${timeZone}</div>
        </div>
            `)
})


app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const entry = pb_entries.find(entry => entry.id === id)
  if (entry) {
    response.json(entry)
  } else {
    response.status(404).end()
  }})


app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  pb_entries = pb_entries.filter(note => note.id !== id)
  response.status(204).end()
})


app.post('/api/persons', (request, response) => {
    const entry = request.body

    if (!entry) {
      return response.status(400).json({
          error: 'body missing'
      })      
    }
    else if(!entry.name) {
        return response.status(400).json({
            error: 'missing name'
        })
    }
    else if(!entry.number) {
        return response.status(400).json({
            error: 'missing number'
        })
    }


    if((pb_entries.map(entry => entry.name)).includes(entry.name)) {
        return response.status(400).json({
            error: 'name already exist'
        })
    }

    const generated_id = Math.floor(Math.random() * (1000 - 1 + 1)) + 1
    const newEntry = {
      name: entry.name,
      number: entry.number,
      id: generated_id.toString()
    }
    pb_entries = pb_entries.concat(newEntry)
    response.json(entry)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

