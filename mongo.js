const mongoose = require('mongoose')

const connectionString = process.env.MONGODB_URI
// primera coneccion a mongodb

mongoose.connect(connectionString, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('database connected')
  }).catch(e => {
    console.error(e)
  })
