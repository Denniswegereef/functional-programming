require('dotenv').config()

const api = require('./oba-api.js')

const chalk = require('chalk');
const express = require('express')
const app = express()
const port = 8080
const splashy = require('splashy')()
const cors = require('cors')

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
  'facet': 'type(book)&facet=language(dut)',
  //'publicationDate': 2018
  'refine': true
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
    setTimeout(function() {
      splashy.fromUrl(book.coverImage).then(
        dominantColors => {
          // Create new key and add it to the list
          book.dominantColors = dominantColors
          return book
        })
    }, 300)
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
  //app.use(cors())
  fs.writeFile("json.json", reponse, 'utf-8', (err) => {
    if (err) {console.error(err) return}
    console.log("File has been created");
});

  // app.get('/', (req, res) => res.json(response))
  // app.listen(port, () => console.log(chalk.green(`Listening on port ${port}`)))
})
.catch(err => {
  //console.log(chalk.red(combineUrl));
  console.error(chalk.red(err))
})
