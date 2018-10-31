// Shout out naar folkert voor deze
const axios = require('axios')
const convert = require('xml-to-json-promise')
const jp = require('jsonpath')
const helpers = require('./helpers.js')
const chalk = require('chalk')

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
}
