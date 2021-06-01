module.exports = (error, request, response, next) => {
  console.error(error)

  if (error.name === 'CastError') {
    response.status(400).send({ error: 'The id is wrong. should be from 1 to 890' })
  } else {
    response.status(500).end()
  }
  console.log(request.body)
}
