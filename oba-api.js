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

    return new Promise((resolve, reject) => {
      let combineUrl = this.url + endpoint + '/?'  + 'authorization=' + this.key + queryToString(params)

      axios.get(combineUrl)
      .then(response => {
        return convert.xmlDataToJSON(response.data)
      })
      .then(response => {
        return resolve({
          data: response,
          url: combineUrl
        })
      })
      .catch(err => {
        console.error(chalk.red(err));
        return eject(err)
      })
    })
  }
}

module.exports = api
