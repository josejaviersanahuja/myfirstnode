require('dotenv').config()
const mongoose = require('mongoose')
const { MONGODB_URI } = process.env
const connectionString = MONGODB_URI
const indexNodata = require('../datapokemons/nodata.json')
const pokemons = require('../datapokemons/pokemon.json')

// primera coneccion a mongodb

mongoose
  .connect(connectionString, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('database connected ')
  })
  .catch((e) => {
    console.error(e)
  })

// Empezamos a meter datos

const PokemonBasicData = require('../models/PokemonBasicData')
const numberToString = (id) => {
  if (id > 99) {
    return id.toString()
  }
  if (id > 9) {
    return ('0' + id.toString())
  }
  if (id < 10) {
    return ('00' + id.toString())
  }
}

pokemons.forEach((pok) => {
  const pokToStore = new PokemonBasicData({
    id: pok.id,
    name: pok.name,
    nodata: indexNodata.includes(pok.id),
    urlimg: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${numberToString(pok.id)}.png`
  })

  pokToStore.save()
    .then(result => {
      console.log(result)
    }).catch(e => {
      console.error(e)
    })
})

// mongoose.connection.close()
