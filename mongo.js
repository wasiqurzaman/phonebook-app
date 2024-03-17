const mongoose = require('mongoose');


if (process.argv.length < 3) {
  console.log('give password as argumant');
  process.exit();
}

const password = process.argv[2]

const url = `mongodb+srv://wasiqurz011:${password}@cluster0.bnexivz.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);


if (process.argv.length > 3) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then(result => {
    // console.log('person saved!');
    // console.log(result);
    console.log(`Added ${result.name} number ${result.number} to phoneboook`)
    mongoose.connection.close();
  });
}

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    // console.log(result);
    console.log('Phoneboook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    })
    mongoose.connection.close();
  })
}