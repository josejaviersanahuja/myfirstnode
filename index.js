
const express = require('express')
const logger = require('./middlewares/logger')
const cors = require('cors')
const pokemonsbd = require('./data/pokemon.json')
const pokemonsYstats = require('./data/pokemonsYstats.json')
const pokemonsYataques = require('./data/pokemonsYataques.json')
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

// para gestión de posts, hace falta un parser que lea objetos en formato json por ejemplo.
app.use(cors()) // por defecto, habilita a todo el mundo a usar nuestra API
app.use(express.json()) // esta es la forma de usar el parser que ofrece expres. Es un middleware
app.use(logger)

app.get('/', (request, response) => { response.send(' <h1>Bienvenido a la primera API de ZitrojjDev</h1> <hr/> <h2>Existen de momento 2 llamadas posibles a esta API</h2> <ol><li><b>/api/pokemons</b> que devuelve un json con 1 array de todos los pokemons</li><li><b>/api/pokemon/:id</b> Ten en cuenta que el id es un número que define a un pokemon. esta llamada devuelve un json con un objeto con detalles y datos del pokemon en cuestión</li></ol>') })

app.get('/api/pokemons', (request, response) => { response.json(pokemonsbd) })
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
        fast_moves: []
      }
      const findcurrentpoke = pokemonsYataques.find(ele => ele.pokemon_name === pokstats.pokemon_name && ele.pokemon_id === pokstats.pokemon_id && ele.form === pokstats.form)
      if (findcurrentpoke.charged_moves) {
        objpok.charged_moves = findcurrentpoke.charged_moves
      }
      if (findcurrentpoke.fast_moves) {
        objpok.fast_moves = findcurrentpoke.fast_moves
      }
      pokemon.push(objpok)
    }
  })
  if (pokemon.length > 0) {
    response.json(pokemon)
    console.log(pokemon)
  } else {
    response.status(204).json()
  }
})

app.use((request, response) => {
  response.status(404).json({
    error: 'page not found'
  })
})
// Levantamos el servidor local y el puerto por donde vamos a escuchar ese servidor.
const PORT = process.env.PORT || 3002
// con express el listen es async, y el log debe entrar como funcion en el parámetro del listen.
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// nuestra app solo va a hacer gets
