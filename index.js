require('dotenv').config()

const axios = require('axios');
const convert = require('xml-to-json-promise');

const baseURL = 'https://zoeken.oba.nl/api/v1/'
const query = 'search/?q=dennis'
const end = 'refine=true'


axios.get(baseURL + query + '&authorization=' + process.env.PUBLIC, + '&' + end)
  .then((response) => {
    return convert.xmlDataToJSON(response.data)
  })
  .then((response) => {
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
