require('dotenv').config()

const api = require('./oba-api.js')
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
  'q': 'harry potter'
}, 'title', true).then(response => {
  
  console.log(response)

  app.get('/', (req, res) => res.json(response.data))
  app.listen(port, () => console.log(chalk.green(`Listening on port ${port}`)))
})
.catch(err => {
  console.log(chalk.red(combineUrl));
  console.error(chalk.red(err));
  return eject(err)
})
