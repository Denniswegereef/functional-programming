// Shout out naar folkert voor deze
const axios = require('axios')
const convert = require('xml-to-json-promise')

const queryToString = require('query-string').stringify

const chalk = require('chalk');

class api {
  constructor(options) {
    this.url = options.url,
    this.key = options.key
  }

  get(endpoint, params = '') {
    // console.log(queryToString(params).replace (/^/,'&'))
    return new Promise((resolve, reject) => {

      // Check if parameter is empty do nothing, otherwise add a & as prefix
      let combineUrl = `${this.url + endpoint}/?authorization=${this.key}${params ? queryToString(params).replace (/^/,'&') : params}`
      // Request to api
      axios.get(combineUrl)
      .then(response => {
        console.log(chalk.cyan(combineUrl));
        // XML to Json
        return convert.xmlDataToJSON(response.data)
      })
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

module.exports = api

// params ? queryToString(params).replace (/^/,'&') : params
