require('dotenv').config()
const express = require('express')
const logger = require('./middlewares/logger')
const cors = require('cors')
// const mongoose = require('mongoose')
const pokemonsbd = require('./datapokemons/pokemon.json')
const pokemonsYstats = require('./datapokemons/pokemonsYstats.json')
const pokemonsYataques = require('./datapokemons/pokemonsYataques.json')
const ataqueRapidoPVP = require('./dataataques/ataques_rapidos_PVP.json')
const ataqueCargadoPVP = require('./dataataques/ataques_cargados_PVP.json')
const pokemonwithnodata = require('./datapokemons/nodata.json')
const pokemonTypes = require('./datapokemons/pokemonTypes.json')
require('./mongo')
const Zitropokemon = require('./models/Zitropokemons')
const handleError = require('./middlewares/handleError')
const handle404 = require('./middlewares/handle404')
// const http = require('http') // como Eslint lo comenta ->
// la dependencia http o express esta declarado en forma de CommonJS module.
// La forma ES6 (EmmaScript) está disponible desde 2020 pero con poca documentación

const app = express() // asi de facil se crea la app con express.
// mira como se crea con http

/* const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' }) //https://developer.mozilla.org/es/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
  response.end(JSON.stringify(notes))
}) */

// trabajemos con express y creemos nuestras propias responses
// const listazitropokemones = [] comentado cuando importamos mongoose
// para gestión de posts, hace falta un parser que lea objetos en formato json por ejemplo.
app.use(cors()) // por defecto, habilita a todo el mundo a usar nuestra API
app.use(express.json()) // esta es la forma de usar el parser que ofrece expres. Es un middleware para manejar posts
// forma de crear modulos y en particular de crear un middleware
app.use(logger)

app.get('/', (request, response) => {
  console.log(request)
  response.send(' <h1>Bienvenido a la primera API de ZitrojjDev</h1> <hr/> <h2>Existen de momento 2 llamadas posibles a esta API</h2> <ol><li><b>/api/pokemons</b> que devuelve un json con 1 array de todos los pokemons</li><li><b>/api/pokemon/:id</b> Ten en cuenta que el id es un número que define a un pokemon. esta llamada devuelve un json con un objeto con detalles y datos del pokemon en cuestión</li><li><b>/api/pvp/all_fast</b>: devuelve todos los ataques rápidos</li><li><b>/api/pvp/all_charged</b>: devuelve todos los ataques cargados</li><li><b>/api/pvp/fast_moves/:name</b>: devuelve el ataque rápido con nombre "name"</li><li><b>/api/pvp/charged_attacks/:name</b>: devuelve el ataque cargado con nombre "name"</li></ol>')
})

app.get('/api/combos', (request, response, next) => {
  Zitropokemon.find().sort({ id: 1 })
    .then(zitropokemon => {
      response.json(zitropokemon)
    }).catch(err => {
      console.log(err)
      next(err)
    })
  console.log(request.body)
})

// return [{Zitropokemon con id}] length=1
app.get('/api/combos/:id', (request, response, next) => {
  const id = Number(request.params.id)

  Zitropokemon.find({ id })
    .then(result => {
      if (result) {
        response.json(result)
      } else {
        response.status(400).end()
      }
    }).catch(err => {
      next(err)
    })
})

app.post('/api/combos', (request, response, next) => {
  const crearpokemon = new Zitropokemon(request.body)
  crearpokemon.save()
    .then(result => {
      console.log(result)
      response.json(result)
      // mongoose.connection.close() Si hago esto daño la app
    }).catch(e => {
      next(e)
    })
})
app.get('/api/pokemons', (request, response) => {
  response.json(pokemonsbd)
  console.log(request.body)
})
app.get('/api/pokemon/:id', (request, response) => {
  const id = request.params.id // este id, siempre será considerado un string

  const pokemon = []
  pokemonsYstats.forEach(pokstats => {
    if (pokstats.pokemon_id === Number(id)) {
      const objpok = {
        id: pokstats.pokemon_id,
        name: pokstats.pokemon_name,
        form: pokstats.form,
        base_attack: pokstats.base_attack,
        base_defense: pokstats.base_defense,
        base_stamina: pokstats.base_stamina,
        charged_moves: [],
        fast_moves: [],
        type: []
      }
      const findcurrentpoke = pokemonsYataques.find(ele => ele.pokemon_name === pokstats.pokemon_name && ele.pokemon_id === pokstats.pokemon_id && ele.form === pokstats.form)
      if (findcurrentpoke.charged_moves) {
        objpok.charged_moves = findcurrentpoke.charged_moves
      }
      if (findcurrentpoke.fast_moves) {
        objpok.fast_moves = findcurrentpoke.fast_moves
      }
      const findcurrentpokType = pokemonTypes.find(ele => ele.pokemon_name === pokstats.pokemon_name && ele.pokemon_id === pokstats.pokemon_id && ele.form === pokstats.form)
      if (findcurrentpokType.type) {
        objpok.type = findcurrentpokType.type
      }
      pokemon.push(objpok)
    }
  })
  if (pokemonwithnodata.find(e => e === Number(id))) {
    const dataToReturn = {
      id: pokemonsbd[Number(id) - 1].id,
      name: pokemonsbd[Number(id) - 1].name,
      nodata: true
    }

    pokemon.push(dataToReturn)
  }
  if (pokemon.length > 0) {
    response.json(pokemon)
    console.log(pokemon)
  } else {
    response.status(204).json({
      error: 'id should be a number from 1 to 890'
    })
  }
})

app.get('/api/pvp/fast_moves/:name', (request, response) => {
  const name = request.params.name
  const finalresponse = ataqueRapidoPVP.find(e => e.name === name)
  if (finalresponse) {
    response.json(finalresponse)
  } else {
    response.status(204).json({
      error: ' fast move not found'
    })
  }
})

app.get('/api/pvp/charged_attacks/:name', (request, response) => {
  const name = request.params.name
  const finalresponse = ataqueCargadoPVP.find(e => e.name === name)
  if (finalresponse) {
    response.json(finalresponse)
  } else {
    response.status(204).json({
      error: 'charged attack not found'
    })
  }
})

app.get('/api/pvp/all_charged/', (request, response) => {
  const finalresponse = ataqueCargadoPVP
  if (finalresponse) {
    response.json(finalresponse)
  } else {
    response.status(500).json()
    console.log(request.body)
  }
})

app.get('/api/pvp/all_fast', (request, response) => {
  const finalresponse = ataqueRapidoPVP
  if (finalresponse) {
    response.json(finalresponse)
  } else {
    response.status(500).json()
    console.log(request.body)
  }
})
// como no entro en ningún get o post, lanza el 404
app.use(handle404)

app.use(handleError)
// Levantamos el servidor local y el puerto por donde vamos a escuchar ese servidor.
const PORT = process.env.PORT || 3002
// con express el listen es async, y el log debe entrar como funcion en el parámetro del listen.
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// nuestra app solo va a hacer gets
