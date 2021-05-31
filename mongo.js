const mongoose = require('mongoose')
const { Schema, model } = require('mongoose')
const password = require('./password')

const connectionString = `mongodb+srv://zitrojj:${password}@mypokemons.j6lhy.mongodb.net/MyPokemons?retryWrites=true&w=majority`

// primera coneccion a mongodb

mongoose.connect(connectionString, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('database connected?')
  }).catch(e => {
    console.error(e)
  })

const zitropokemonSchema = new Schema(
  {
    id: Number,
    name: String,
    base_attack: Number,
    base_defense: Number,
    base_stamina: Number,
    forms: Array,
    nodata: Boolean
  }
)

const Zitropokemon = model('Zitropokemon', zitropokemonSchema)

const zitropok = new Zitropokemon({
  id: 235,
  name: 'Smeargle',
  base_attack: 100,
  base_defense: 100,
  base_stamina: 100,
  forms: [
    {
      form: 'Normal'
    }
  ],
  nodata: false
})

zitropok.save()
  .then(result => {
    console.log(result)
    mongoose.connection.close()
  }).catch(e => {
    console.error(e)
  })
