require('dotenv').config()
const mongoose = require('mongoose')
const { MONGODB_URI } = process.env
const connectionString = MONGODB_URI
const indexNodata = require('../datapokemons/nodata.json')
const pokemonStats = require('../datapokemons/pokemonsYstats.json')
const pokemonTypes = require('../datapokemons/pokemonTypes.json')
const pokemonAtacks = require('../datapokemons/pokemonsYataques.json')
const allFast = require('../dataataques/ataques_rapidos_PVP.json')
const allCharged = require('../dataataques/ataques_cargados_PVP.json')
const pokemons = require('../datapokemons/pokemon.json')

console.log(MONGODB_URI)

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

const PokemonFullData = require('../models/PokemonFullData')
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
// fast_moves y charged_moves son arrays de strings //
const allCombos = (fastmoves, chargedmoves) => {
  const arrayDeFastMoves = fastmoves.map(e => allFast.find(ataque => ataque.name === e))
  const arrayDeChargedMoves = chargedmoves.map(e => allCharged.find(ataque => ataque.name === e))
  const arrayAllCombos = []
  arrayDeFastMoves.forEach(element => {
    const temp = element

    arrayDeChargedMoves.forEach(eleCharged => {
      const combo = {}
      combo.namefast = temp.name
      combo.powerfast = temp.power
      combo.addEnergyAmount = temp.energy_delta
      combo.turn = temp.turn_duration
      combo.addEnergySpeed = temp.energy_delta / (temp.turn_duration * 0.5)
      combo.typeFast = temp.type
      combo.namecharged = eleCharged.name
      combo.typecharged = eleCharged.type
      combo.powercharged = (eleCharged.type === combo.typeFast) ? eleCharged.power * 1.2 : eleCharged.power
      combo.energyrequired = eleCharged.energy_delta
      combo.howmanypunches = Math.ceil(-combo.energyrequired / combo.addEnergyAmount)
      combo.howlongtocharge = combo.howmanypunches * combo.turn * 0.5
      arrayAllCombos.push(combo)
    })
  })

  return arrayAllCombos
}

pokemons.forEach((pok) => {
  const finalForm = []
  const dataArrayFormsAttacks = pokemonAtacks.filter(ele => pok.id === ele.pokemon_id)
  const dataArrayFormsStats = pokemonStats.filter(ele => pok.id === ele.pokemon_id)
  const dataArrayFormsTypes = pokemonTypes.filter(ele => pok.id === ele.pokemon_id)
  if (!indexNodata.includes(pok.id)) { // si existen datos del pokemon
    dataArrayFormsTypes.forEach(e => {
      const objToPush = {}
      objToPush.type = e.type
      objToPush.form = e.form
      const statsThisForm = dataArrayFormsStats.filter(ele => ele.form === e.form)
      objToPush.base_attack = statsThisForm[0].base_attack
      objToPush.base_defense = statsThisForm[0].base_defense
      objToPush.base_stamina = statsThisForm[0].base_stamina
      const attacksThisForm = dataArrayFormsAttacks.filter(ele => ele.form === e.form)
      objToPush.fast_moves = attacksThisForm[0].fast_moves
      objToPush.charged_moves = attacksThisForm[0].charged_moves
      if (attacksThisForm[0].charged_moves.length === 0 | attacksThisForm[0].fast_moves.length === 0) {
        objToPush.all_combos = []
      } else {
        objToPush.all_combos = allCombos(attacksThisForm[0].fast_moves, attacksThisForm[0].charged_moves)
      }
      finalForm.push(objToPush)
    })
    const pokToStore = new PokemonFullData({
      id: pok.id,
      name: pok.name,
      nodata: indexNodata.includes(pok.id),
      urlimg: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${numberToString(pok.id)}.png`,
      form: finalForm
    })
    pokToStore.save()
      .then(result => {
        console.log(result)
      }).catch(e => {
        console.error(e)
      })
  } else {
    const pokToStore = new PokemonFullData({
      id: pok.id,
      name: pok.name,
      nodata: indexNodata.includes(pok.id),
      urlimg: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${numberToString(pok.id)}.png`,
      form: []
    })
    pokToStore.save()
      .then(result => {
        console.log(result)
      }).catch(e => {
        console.error(e)
      })
  }
})
