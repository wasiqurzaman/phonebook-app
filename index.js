require('dotenv').config()
const express = require("express");
const app = express();
const morgan = require('morgan');
const cors = require("cors");
const Person = require('./models/person');

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());


// using the morgan middleware for logging
morgan.token("getBody", function (req, res) {
  // console.log('response', res);
  if (req.method === "POST") return JSON.stringify(req.body);
  return null;
})

app.use(morgan(":method :url :status :response-time ms :getBody"));


app.get('/info', (request, response) => {
  Person.find({})
    .then(persons => {
      response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`)
    })
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  })
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  });

  person.save()
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson);
    })
    .catch(error => next(error));
})

// Error handler middleware
const handleError = (error, request, response, next) => {
  console.log(error);
  if (error.name === "CastError") {
    return response.status(404).send({ error: "malformatted id" });
  }
  next(error);
}

app.use(handleError);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`)
})
