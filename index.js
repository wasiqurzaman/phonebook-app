const express = require("express");
const app = express();
const morgan = require('morgan');
const cors = require("cors");

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

let persons = [
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

// using the morgan middleware for logging
morgan.token("getBody", function (req, res) {
  // console.log('response', res);
  if (req.method === "POST") return JSON.stringify(req.body);
  return null;
})

app.use(morgan(":method :url :status :response-time ms :getBody"));

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>
  `)
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);
  console.log(person)
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);
  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * 10000);
}

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (persons.find(p => p.name === body.name)) {
    return response.status(404).json({
      error: "name must be unique"
    });
  }

  if (!body.name || !body.number) {
    return response.status(404).json({
      error: "name and number are required"
    });
  }
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person);
  response.json(person);
});




const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`)
})
