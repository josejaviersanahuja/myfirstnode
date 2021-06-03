const supertest = require('supertest')
const mongoose = require('mongoose')
const { app, server } = require('../index')
const Zitropokemon = require('../models/Zitropokemons')
const api = supertest(app)

const pokemons = [
  {
    id: 1,
    name: 'Bulbasaur',
    forms: [],
    nodata: false
  },
  {
    id: 2,
    name: 'Ivasaur',
    forms: [],
    nodata: false
  }
]

beforeEach(async () => {
  await Zitropokemon.deleteMany({})

  const pokemon1 = new Zitropokemon(pokemons[0])
  const pokemon2 = new Zitropokemon(pokemons[1])

  await pokemon1.save()
  await pokemon2.save()
})

describe('API combos ', () => {
  test('are returned as json', async () => {
    await api
      .get('/api/combos')
      .expect(200)
      .expect('content-type', /application\/json/)
  })

  test('return an array ', async () => {
    const response = await api.get('/api/combos')
    expect(response.body).toHaveLength(pokemons.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
// Tests aleatorios, lo comento para apuntes
/* function palindrome (str) {
  return str.split('').reverse().join('')
}

describe('palidrome', () => {
  test(' de ZITROJJ', () => {
    const result = palindrome('ZITROJJ')

    expect(result).toBe('JJORTIZ')
  })

  test(' de String vacío', () => {
    const result = palindrome('')

    expect(result).toBe('') // expect jestjs.io/docs/en/expect
  })
})
 */
