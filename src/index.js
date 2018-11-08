d3.json('data.json').then(data => {
  const booksByYear = d3
    .nest()
    .key(book => book.publication)
    .entries(data)

  const yearsSortedColor = booksByYear.map(year => ({
    year: Number(year.key),
    data: d3
      .nest()
      .key(book => book.nearestColor.name)
      .rollup(color => color.length)
      .entries(year.values)
      .sort((a, b) => b.value - a.value)
  }))

  const nicerColorPoints = d3
    .nest()
    .key(book => book.nearestColor.name)
    .rollup(book => book[0].nearestColor.value)
    .entries(data)
    .map(({ key, value }) => ({
      label: key,
      color: value,
      values: yearsSortedColor.map(({ year, data }) => {
        console.log(data)
        let pos = data.map(z => z.key).indexOf(key)
        console.log(pos)
        return {
          year,
          value: pos == '-1 ' ? 10 : pos + 1
        }
      })
    }))

  const margin = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50
    },
    width = window.innerWidth - margin.left - margin.right,
    height = 400

  const minMax = d3.extent(booksByYear.map(year => year.key))

  const xScale = d3
    .scaleLinear()
    .domain(minMax)
    .range([0, width])

  const yScale = d3
    .scaleLinear()
    .domain([10, 1])
    .range([height, 0])

  var line = d3
    .line()
    .x(color => xScale(color.year))
    .y(color => yScale(color.value))

  var svg = d3
    .select('#visualisation')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  svg
    .append('g')
    .attr('class', 'x axis')
    .style('color', '#fff')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(xScale).tickFormat(d3.format('d')))

  svg
    .append('g')
    .style('color', '#fff')
    .attr('class', 'y axis')
    .call(d3.axisLeft(yScale))

  console.log(nicerColorPoints)
  nicerColorPoints.forEach((color, index) => {
    const path = svg
      .append('path')
      .datum(color.values)
      .style('stroke', color.color)
      .attr('class', 'line')
      .attr('d', line)

    svg
      .selectAll('dot')
      .data(color.values)
      .enter()
      .append('circle')
      .style('fill', '#fff') // <== and this one
      .attr('r', 1)
      .attr('cx', function(d) {
        console.log(d.year)
        return xScale(d.year)
      })
      .attr('cy', function(d) {
        return yScale(d.value)
      })

    const totalLength = path.node().getTotalLength()

    path
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(index * 300 + 1000)
      .attr('stroke-dashoffset', 0)
  })
})
