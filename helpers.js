module.exports =  {
  combineUrl(url, endpoint, secretKey, params) {
    return `${url + endpoint}/?authorization=${secretKey}${params ? queryToString(params).replace (/^/,'&') : params}`
  }
}
