require('dotenv').config()

const api = require('../oba-api.js')
const chalk = require('chalk');
const express = require('express')
const app = express()
const port = 3000

const splashy = require('splashy')()

const obaApi = new api({
  url: 'https://zoeken.oba.nl/api/v1/',
  key: process.env.PUBLIC
})

// Search for method, params and than optional where you wanna find something
obaApi.get('search', {
  'q': 'harry potter',
  'librarian': true
}, 'coverimage', true).then(response => {

  response.data.forEach(item => {
    splashy.fromUrl(item).then(res => {
      console.log(res)
    })
  })

  console.log(response.data)

  app.get('/', (req, res) => res.json(newArr))
  app.listen(port, () => console.log(chalk.green(`Listening on port ${port}`)))
})
.catch(err => {
  console.log(chalk.red(combineUrl));
  console.error(chalk.red(err));
  return eject(err)
})
