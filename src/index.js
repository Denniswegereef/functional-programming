fetch('http://localhost:8080').then(res => {
  return res.json()
}).then(res => {

  res.forEach(item => {
    item.publication = +item.publication
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


// d3.json('buildings.json').then(res => {
//   res.forEach(item => {
//     item.height = +item.height
//   })
//
//   console.log(res)
//
//   const svg = d3.select('body')
//     .append('svg')
//     .attr('width', '100vw')
//     .attr('height', '100vh')
//
//   const circles = svg.selectAll('circle')
//     .data(res)
//
//   circles.enter()
//     .append('circle')
//       .attr('cx', (item, index) => {
//         //console.log(item.height)
//         return 100 + index * 150
//       })
//       .attr('cy', 200)
//       .attr('r', item => item.height / 4)
//       .attr('fill', item => item.height > 250 ? 'blue' : 'yellow');
// }).catch(err => {
//   console.log(err)
// })
//
// d3.json('buildings.json').then(res => {
//   res.forEach(item => {
//     item.height = +item.height
//   })
//
//   //console.log(res)
//
//   const y = d3.scaleLinear()
//     .domain([0, 800]) // Min, max hoe die in de range moet komen
//     .range([0, 500]) // Pixel waarde waar het tussen moet bewegen
//     // (bijv. 0, 828 als je er dan 414 inkomt komt die op de helft van de range)
//
//   //console.log(y.invert(500))
//
//   const svg = d3.select('body')
//     .append('svg')
//       .attr('width', 500)
//       .attr('height', 500)
//
//   const bars = svg.selectAll('rect')
//     .data(res)
//
//     bars.enter()
//     .append('rect')
//       .attr('x', ((building, index) => 50 * index))
//       .attr('y', building => 0)
//       .attr('height', building => y(building.height))
//       .attr('width', 40)
//       .attr('fill', building => building.height > 250 ? 'blue' : 'yellow')
//
//
// }).catch(err => {
//   console.log(err)
// })
