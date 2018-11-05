require('dotenv').config()

const api = require('./oba-api.js')

const chalk = require('chalk');
const express = require('express')
const app = express()
const port = 8080

const obaApi = new api({
  url: 'https://zoeken.oba.nl/api/v1/',
  key: process.env.PUBLIC
})
