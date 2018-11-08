d3.json('data.json').then(data => {
  // console.log(data)

  const booksByYear = d3
    .nest()
    .key(book => book.publication)
    .entries(data)

  //console.log(allColors);
  // Sort data by color
  const yearsSortedColor = booksByYear.map(year => ({
    year: Number(year.key),
    data: d3
      .nest()
      .key(book => book.nearestColor.name)
      .rollup(color => color.length)
      .entries(year.values)
      .sort((a, b) => b.value - a.value)
  }))
  //=== -1 ? 0 : pos + 1
  const nicerColorPoints = d3
    .nest()
    .key(book => book.nearestColor.name)
    .entries(data)
    .map(({ key }) => ({
      label: key,
      color: '#bada55',
      values: yearsSortedColor.map(({ year, data }) => {
        let pos = data.map(z => z.key).indexOf(key)
        return {
          year,
          value: pos
        }
      })
    }))

  var margin = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50
    },
    width = window.innerWidth - margin.left - margin.right, // Use the window's width
    height = window.innerHeight - margin.top - margin.bottom // Use the window's height

  // The number of datapoints
  var n = booksByYear.length

  const minMax = d3.extent(booksByYear.map(year => year.key))

  // 5. X scale will use the index of our data
  var xScale = d3
    .scaleLinear()
    .domain(minMax) // input
    .range([0, width])
  // output

  // 6. Y scale will use the randomly generate number
  var yScale = d3
    .scaleLinear()
    .domain([10, 1]) // input
    .range([height, 0]) // output

  // 7. d3's line generator
  var line = d3
    .line()
    .x(function(color, i) {
      return xScale(color.year)
    }) // set the x values for the line generator
    .y(function(color) {
      return yScale(color.value)
    }) // set the y values for the line generator
  //  .curve(d3.curveMonotoneX) // apply smoothing to the line

  // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
  var dataset = d3.range(n).map(function(d) {
    return {
      y: d3.randomUniform(10)()
    }
  })

  //console.log(dataset);
  // 1. Add the SVG to the page and employ #2
  var svg = d3
    .select('#visualisation')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  // 3. Call the x axis in a group tag
  svg
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(xScale).tickFormat(d3.format('d'))) // Create an axis component with d3.axisBottom

  // 4. Call the y axis in a group tag
  svg
    .append('g')
    .attr('class', 'y axis')
    .call(d3.axisLeft(yScale)) // Create an axis component with d3.axisLeft
  // 9. Append the path, bind the data, and call the line generator

  nicerColorPoints.forEach(color => {
    svg
      .append('path')
      .datum(color.values) // 10. Binds data to the line
      .style('stroke', color.color)
      .attr('class', 'line') // Assign a class for styling
      .attr('d', line) // 11. Calls the line generator
  })
  // 12. Appends a circle for each datapoint
  // svg.selectAll(".dot")
  //   .data(red)
  //   .enter().append("circle") // Uses the enter().append() method
  //   .attr("class", "dot") // Assign a class for styling
  //   .attr("cx", function(d, i) {
  //     return xScale(i)
  //   })

  // .attr("cy", function(d) {
  //   return yScale(d.value)
  // })
})
