
const { Schema, model } = require('mongoose')

const pokemonBasicData = new Schema(
  {
    id: Number,
    name: String,
    nodata: Boolean,
    urlimg: String
  }
)
// con esta función podemos parsear nosotros el objeto que recibimos de la base de datos
/* zitropokemonSchema.set('toJSON', {
  trasnform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._v
  }
})
 */
const PokemonBasicData = model('PokemonBasicData', pokemonBasicData)

module.exports = PokemonBasicData

// el siguiente bloque devuelve a todos los elementos
/* Zitropokemon.find({})
  .then(result => {
    console.log(result)
    mongoose.connection.close()
  }) */

// Bloque comentado porque es el test de guardado
/* const zitropok = new Zitropokemon({
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
 */
