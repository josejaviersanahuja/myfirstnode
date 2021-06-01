module.exports = (request, response, next) => {
  response.status(404).end()
  console.log(request.body)
}
