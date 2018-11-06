fetch('http://localhost:8080').then(res => {
  return res.json()
}).then(res => {

  res.forEach(book => {
    book.publication = Number(book.publication)
  })

  console.log(res)

  const svg = d3.select('body')
    .append('svg')
    .attr('width', '100vw')
    .attr('height', '100vh')

  const circles = svg.selectAll('circle')
    .data(res)

  circles.enter()
    .append('circle')
    .attr('cx', (book, index) => {
      return 40 + 30 * index
    })
    .attr('cy', 10)
    .attr('r', 10)
    .attr('fill', book => book.nearestColor.value)
}).catch(err => {
  console.log(err)
})
