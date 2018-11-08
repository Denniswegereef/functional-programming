d3.json('data.json').then(data => {
  document.querySelector('#amountofbooks').textContent = data.length + ' books'

  // Get unique years
  const booksByYear = d3
    .nest()
    .key(book => book.publication)
    .entries(data)

  // Sort books by year
  const yearsSortedColor = booksByYear.map(year => ({
    year: Number(year.key),
    data: d3
      .nest()
      .key(book => book.nearestColor.name)
      .rollup(color => color.length)
      .entries(year.values)
      .sort((a, b) => b.value - a.value)
  }))

  // Create the right format
  const nicerColorPoints = d3
    .nest()
    .key(book => book.nearestColor.name)
    .rollup(book => book[0].nearestColor.value)
    .entries(data)
    .map(({ key, value }) => ({
      label: key,
      color: value,
      values: yearsSortedColor.map(({ year, data }) => {
        let pos = data.map(z => z.key).indexOf(key)
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
    height = 500,
    domain = 10,
    minMax = d3.extent(booksByYear.map(year => year.key))

  const xScale = d3
    .scaleLinear()
    .domain(minMax)
    .range([0, width])

  const yScale = d3
    .scaleLinear()
    .domain([domain, 1])
    .range([height, 0])

  const line = d3
    .line()
    .x(color => xScale(color.year))
    .y(color => yScale(color.value))
  //  .curve(d3.curveBasis)

  // Canvas
  const svg = d3
    .select('#visualisation')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  // x-axis
  svg
    .append('g')
    .attr('class', 'x-axis')
    .style('color', '#fff')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(xScale).tickFormat(d3.format('d')))

  svg
    .append('g')
    .attr('class', 'grid-x-axis')
    .call(
      d3
        .axisLeft(yScale)
        .ticks(domain)
        .tickSize(-width)
        .tickFormat('')
    )

  svg
    .append('text')
    .attr('x', 10)
    .attr('transform', 'rotate(90)')
    .text('Meest gekozen naar minst gekozen kleuren')
    .attr('fill', '#FF1493')
    .attr('y', '40')
    .attr('x', '0')

  svg
    .append('text')
    .attr('x', 10)
    .text('Jaartallen')
    .attr('fill', '#FF1493')
    .attr('y', height + 40)
    .attr('x', '0')

  svg
    .append('g')
    .style('color', '#fff')
    .attr('class', 'y axis')
    .call(d3.axisLeft(yScale))

  const tooltip = svg
    .append('g')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .text('a simple tooltip')

  nicerColorPoints.forEach((color, index) => {
    const path = svg
      .append('path')
      .attr('class', 'lines')
      .datum(color.values)
      .style('stroke', color.color)
      .attr('class', 'line')
      .attr('d', line)
      .on('mouseover', function() {
        d3.selectAll('svg')
          .selectAll('.line')
          .style('stroke-width', '.5px')
        d3.select(this).style('stroke-width', '7px')
      })
      .on('mouseout', function() {
        d3.selectAll('svg')
          .selectAll('.line')
          .style('stroke-width', '2px')
      })

    svg
      .selectAll('dot')
      .data(color.values)
      .enter()
      .append('circle')
      .style('fill', '#fff')
      .attr('r', 1)
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d.value))

    const totalLength = path.node().getTotalLength()

    path
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(index * 300 + 1000)
      .attr('stroke-dashoffset', 0)
  })
})
