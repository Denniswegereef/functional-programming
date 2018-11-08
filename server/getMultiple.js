require('dotenv').config()
const api = require('./oba-api.js')
const chalk = require('chalk');

const express = require('express')
const app = express()
const cors = require('cors')
const port = 8080

const axios = require('axios')
const fs = require('fs')

const splashy = require('splashy')()

const nearestColor = require('nearest-color').from(
  {
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
)

const obaApi = new api({
  url: 'https://zoeken.oba.nl/api/v1/',
  key: process.env.PUBLIC
})

obaApi.getMore([2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018])
  .then(response => {
    return response.reduce((total, year) => total.concat(year), [])
    .reduce((total, page) => total.concat(page.aquabrowser.results[0].result), [])
  })
  .then(response => {
    return response.map(book => {
      return {
        title: book.titles[0].title[0]['_'],
        coverImage: book.coverimages[0].coverimage[0]['_'],
        publication: book.publication[0].year[0]['_']
      }
    })
  })
  .then(response => {
    return Promise.all(response.map(getDominantColors))

    function getDominantColors(book) {
      let current = book
      return splashy
        .fromUrl(book.coverImage)
        .then(dominantColors => {
          current.dominantColors = dominantColors
          return current
        }, function (err) {
          console.log('faal: ', err)
          return current;
        })
    }
  })
  .then(response => {
    return Promise.all(response.map(book => {
      console.log(book)
        if (book.dominantColors) {
          book.nearestColor = nearestColor(book.dominantColors[0])
          delete book.nearestColor.distance
          return book
        } else {
          book.nearestColor = ['no color']
          return book
        }
      }
    ))
  })
  .then(response => {
    app.get('/', (req, res) => res.json(response))
    app.listen(port, () => console.log(chalk.green(`Listening on port ${port}`)))

    //   fs.writeFile("src/json.json", JSON.stringify(response) , 'utf-8', (err) => {
    //   if (err) {
    //     console.log(err)
    //   } else {
    //     console.log("File has been created")
    //   }
    // })


  }).catch(err => {
    console.log(err)
  })
