require('dotenv').config()

const api = require('./oba-api.js')

const chalk = require('chalk');
const express = require('express')
const app = express()
const port = 8080
const axios = require('axios')

const obaApi = new api({
  url: 'https://zoeken.oba.nl/api/v1/',
  key: process.env.PUBLIC
})

// years.forEach(function(currentValue){
//   console.log(currentValue)
//   yearUrl = `https://zoeken.oba.nl/api/v1/search/?authorization=1e19898c87464e239192c8bfe422f280&q=genre:erotiek&facet=pubYear(${currentValue})&refine=true`
//   promises.push(axios.get(yearUrl))
// })
//
// axios.all(promises).then(result => {
//     result.forEach(function(response) {
//         console.log(response)
//     })
// });

let years = [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018]

obaApi.getMore('', '', years).then(response => {
  app.get('/', (req, res) => res.json(response))
  app.listen(port, () => console.log(chalk.green(`Listening on port ${port}`)))
})

//
// axios.all([
//   obaApi.get('search', {
//     'q': 'genre:erotiek',
//     'facet': 'type(book)&facet=language(dut)',
//     'facet': 'pubYear(2013)',
//     'refine': true
//   }),
//   obaApi.get('search', {
//     'q': 'genre:erotiek',
//     'facet': 'type(book)&facet=language(dut)',
//     'facet': 'pubYear(2014)',
//     'refine': true
//   })
// ])
//   .then(response => {
//     let data = response[0].data
//     //console.log(acct)
//     //console.log(data)
//
//     for (const prop in data) {
//       console.log(`obj.${prop} = ${data[prop]}`);
//     }
//
//     return data
//   })
//   .then(response => {
//     app.get('/', (req, res) => res.json(response))
//     app.listen(port, () => console.log(chalk.green(`Listening on port ${port}`)))
//   })
//   .catch(err => {
//     console.error(chalk.red(err));
//   })
