require('dotenv').config()



const api = require('./oba-api.js')
const helpers = require('./helpers.js')

const chalk = require('chalk');
const express = require('express')
const app = express()
const port = 3000
const splashy = require('splashy')()
var color = require('dominant-color')



var colors = {
  white:	'#FFFFFF',
  // silver:	'#C0C0C0',
  // gray:	'#808080',
  black:	'#000000',
  red:	'#FF0000',
  maroon:	'#800000',
  yellow:	'#FFFF00',
  //olive:	'#808000',
  lime:	'#00FF00',
  green:	'#008000',
  aqua:	'#00FFFF',
  teal:	'#008080',
  blue:	'#0000FF',
  navy:	'#000080',
  fuchsia:	'#FF00FF',
  purple:	'#800080'
}

const nearestColor = require('nearest-color').from(colors);

const obaApi = new api({
  url: 'https://zoeken.oba.nl/api/v1/',
  key: process.env.PUBLIC
})

// Search for method, params and than optional where you wanna find something
obaApi.get('search', {
  'q': 'genre:erotiek',
  'facet': 'type(book)&facet=language(dut)'
  //'publicationDate': 2018
  //'facet': 'pubYear(2014)'
  // 'facet': 'format(book)',
  //'sort': 'year'
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
  return Promise.all(response.map(book =>
    // Find the color palette
    splashy.fromUrl(book.coverImage).then(
      dominantColors => {
        // Create new key and add it to the list
        book.dominantColors = dominantColors
        return book
      })
  ))
})
.then(response => {
  return Promise.all(response.map(book => {
      book.nearestColor = nearestColor(book.dominantColors[0])
      return book
    }
  ))
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

//
// .then(response => {
//   const bookObject = response
//
//   bookObject.forEach((book, index) => {
//
//     splashy.fromUrl(book.coverImage)
//     .then(dominantColors => {
//
//       bookObject[index].dominantColors = dominantColors
//     })
//   })
//   return bookObject
// })
