fetch('http://localhost:8080')
  .then(res => {
    return res.json()
  })
  .then(res => {
    const allBooks = res
    allBooks.forEach(book => {
      book.publication = Number(book.publication)
    })

    //console.log(allBooks)

    const svg = d3
      .select('body')
      .append('svg')
      .attr('width', '600')
      .attr('height', '400')

    const filtered = allBooks.filter(book => {
      if (book.publication === 2014) {
        return book
      }
    })

    console.log(filtered)

    const xScale = d3
      .scaleBand()
      .domain(allBooks.map(book => book.publication))
      .range([0, 600])
      .paddingInner(0.1)

    const yScale = d3.scaleLinear().domain([0, 10])

    const circles = svg
      .selectAll('rect')
      .data(res)
      .enter()
      .append('rect')
      .attr('y', 40)
      .attr('x', book => xScale(book.publication))
      .attr('width', xScale.bandwidth)
      .attr('height', 50)
      .attr('fill', book => book.nearestColor.value)
  })
  .catch(err => {
    console.log(err)
  })
