const mongoose = require('mongoose')
const { MONGODB_URI, MONGODB_URI_TEST, NODE_ENV } = process.env

const connectionString = NODE_ENV === 'test' ? MONGODB_URI_TEST : MONGODB_URI

// primera coneccion a mongodb

mongoose.connect(connectionString, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('database connected en modo ' + NODE_ENV + ' a la base de datos ')
  }).catch(e => {
    console.error(e)
  })
