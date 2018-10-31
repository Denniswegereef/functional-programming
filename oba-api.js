// Shout out naar folkert voor deze
const axios = require('axios')
const convert = require('xml-to-json-promise')
const queryToString = require('query-string').stringify
const jp = require('jsonpath')
const helpers = require('./helpers.js')
const chalk = require('chalk')

module.exports = class api {
  constructor(options) {
    this.url = options.url,
    this.key = options.key
  }

  getUrl(endpoint, params) {
    let checkForParams = params ? queryToString(params).replace (/^/,'&') : params
    return this.url + endpoint + '/?authorization=' + this.key + checkForParams
  }

  get(endpoint, params = '', keySearch = '', slice = false) {
    // console.log(queryToString(params).replace (/^/,'&'))
    return new Promise((resolve, reject) => {
      // Check if parameter is empty do nothing, otherwise add a & as prefix
      let combineUrl = this.getUrl(endpoint, params)
      //  let url = helpers.combineUrl(this.url, endpoint, this.key, params)
      axios.get(combineUrl)
      .then(response => {
        console.log(chalk.cyan(combineUrl))
        // XML to Json
        return convert.xmlDataToJSON(response.data)
      })
      // Search querey
      .then(response => {
        return keySearch ? jp.query(response, `$..${keySearch}`) : response
      })
      // Slice everything away from the array
      .then(response => {
        if(keySearch && slice) {
          const newArr = response.map(item =>
            (item[0]["_"] ? item[0]["_"] : item[0])
          )
          return newArr
        } else {
          return response
        }
      })
      // Make object response
      .then(response => {
        return resolve({
          data: response,
          url: combineUrl
        })
      })
      .catch(err => {
        console.log(chalk.red(combineUrl));
        console.error(chalk.red(err));
        return eject(err)
      })
    })
  }
}
