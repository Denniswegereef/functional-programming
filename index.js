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

var nearestColors = {
  red: '#f00',
  yellow: '#ff0',
  blue: '#00f'
}

// Search for method, params and than optional where you wanna find something
obaApi.get('search', {
  'q': 'genre:erotiek',
  'lang': 'nl',
  'facet': 'type:book',
  'facet': 'pubYear(2018)'
  // 'facet': 'format(book)',
  // 'sort': 'year(2018)'
})
.then(response => {
  let results = response.data.aquabrowser.results[0].result

  return results.map(book => {
    return {
      title: book.titles[0].title[0]['_'],
      coverImage: book.coverimages[0].coverimage[0]['_'],
      publication: book.publication[0].year[0]['_']
    }
  })
})
.then(response => {
  const bookObject = response

  bookObject.forEach((book, index) => {

    splashy.fromUrl(book.coverImage)
    .then(dominantColors => {

      bookObject[index].dominantColors = dominantColors
    })
  })
  return bookObject
})
.then(response => {
  // response.forEach(item)
  return response
})
.then(response => {
  app.get('/', (req, res) => res.json(response))
  app.listen(port, () => console.log(chalk.green(`Listening on port ${port}`)))
})
.catch(err => {
  //console.log(chalk.red(combineUrl));
  console.error(chalk.red(err));
  return reject(err)
})
