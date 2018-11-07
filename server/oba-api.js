// Shout out naar folkert voor deze
const axios = require('axios')
const convert = require('xml-to-json-promise')
const jp = require('jsonpath')
const helpers = require('./helpers.js')
const chalk = require('chalk')
var parseString = require('xml2js').parseString

module.exports = class api {
  constructor(options) {
    this.url = options.url,
    this.key = options.key
  }

  stringify(object) {
    const keys = Object.keys(object)
    const values = Object.values(object)
    return keys.map((key, i) => `&${key}=${values[i]}`).join('')
  }

  get(endpoint, params = '', keySearch = '', slice = false) {
    // console.log(queryToString(params).replace (/^/,'&'))
    return new Promise((resolve, reject) => {
      // Check if parameter is empty do nothing, otherwise add a & as prefix
      let combineUrl = this.url + endpoint + '/?authorization=' + this.key + this.stringify(params)
      //  let url = helpers.combineUrl(this.url, endpoint, this.key, params)
      axios.get(combineUrl)
      .then(response => {
        console.log(chalk.cyan(combineUrl))
        // XML to Json
        return convert.xmlDataToJSON(response.data)
      })
      .then(response => {
        if(keySearch) {
          return jp.query(response, `$..${keySearch}`)
        } return response
      })
      // Slice everything away from the array
      .then(response => {
        // const strippedItems = response.map(item => item[0]["_"])
        // keySearch && slice ? strippedItems : response

        if(keySearch && slice) {
          const newArr = response.map(item =>
            item[0]["_"]
          )
          return newArr
        } return response
      })
      // Make object response
      .then(response => {
        // console.log(response)
        return resolve({
          data: response,
          url: combineUrl
        })
      })
      .catch(err => {
        console.log(chalk.red(combineUrl));
        console.error(chalk.red(err));
        return reject(err)
      })
    })
  }

  getUrls(years) {
    const base = 'https://zoeken.oba.nl/api/v1/search/'
    const publicKey = '1e19898c87464e239192c8bfe422f280'

    return Promise.all(years.map(requestYear))

    function requestYear(year) {
      const all = []
      let page = 1

      return send()

      function send() {
        return axios
          .get(`${base}?authorization=${publicKey}&q=book&facet=pubYear(${year})&refine=true&page=${page}`)
          .then(res => res.data)
          .then(convert.xmlDataToJSON)
          .then(next, console.error)
          .then(res => {
            if (res) {
              console.log(year, res.length)
              return res
            }
          })
      }

      function next(aantalBoeken) {
        all.push(aantalBoeken)
        let amountOfPages = Math.ceil(aantalBoeken.aquabrowser.meta[0].count[0] / 20)
        //console.log(Math.ceil(aantalBoeken.aquabrowser.meta[0].count[0] / 20))

        if (page < amountOfPages) {
          page++
          //console.log(year, page)
          return send()
        } else {
          //console.log(year, all.length);
          //console.log(all);
          return all
          //console.log('alles klaar')
          //console.log(aantalBoeken.length)
          //return aantalBoeken.length
        }
      }
    }
  }

  getMore(endpoint = '', params = '', years) {
    return new Promise((resolve, reject) => {

      this.getUrls(years)
      .then(response => {
        console.log(response);
        resolve(response)
        // console.log(response)
        // return response.map(allYear => {
        //   let data = convert.xmlDataToJSON(response[0].data)
        //   return data
        // })
      })
      .then(response => {
        //console.log(response)
        resolve(response)
      })
      // .then(response => {
      //   // console.log(response)
      //   // console.log(response.length);
      // })
      // .then(response => parseString(response, (err, result) => {
      //   return result
      // }))
      // .then(response => {
      //   resolve(response)
      // })
      .catch(err => {
        console.log(err)
      })
    })
  }
}
