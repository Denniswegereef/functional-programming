d3.json("data.json").then(data => {
  console.log(data)

  const booksByYear = d3.nest()
    .key(book => book.publication)
    .entries(data)

  const allColors = d3.nest()
      .key(book => book.nearestColor.name)
      .entries(data)

  const booksSortedColor = booksByYear.map(year => {
    const sortedData = d3.nest()
      .key(book => book.nearestColor.name)
      .rollup(color => color.length)
      .entries(year.values)
      .sort((a, b) => b.value - a.value)

    return {
      year: year.key,
      data: sortedData
    }
  })

  booksByYear.map(year => {
    // console.log(year.key);
    // console.log(year.values);

    const sortedData = d3.nest()
      .key(book => book.nearestColor.name)
      .rollup(color => color.length)
      .entries(year.values)
  })

  //console.log(booksByYear);

  // Expected
  // red [
  //   {
  //     amount: 14,
  //     year: 2008
  //   }
  // ]
  //
  // console.log(booksByYear)
  // console.log(booksSortedColor)


  var margin = {
      left: 80,
      right: 100,
      top: 50,
      bottom: 100
    },
    height = 500 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;

  var svg = d3.select("#visualisation").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left +  ", " + margin.top + ")");

    // Scales
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0])


  // Set scale domains
  x.domain(d3.extent(booksByYear, function(d) {
    return d.key;
  }))

  y.domain(
    [d3.min(booksSortedColor[0].data, (book) => book.value),
    d3.max(booksSortedColor[0].data, (book) => book.value)]
  )

  var xAxisCall = d3.axisBottom()
  var yAxisCall = d3.axisLeft()
    .ticks(20)

    // Axis groups
  var xAxis = g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")");
  var yAxis = g.append("g")
      .attr("class", "y axis")

      // Y-Axis label
      yAxis.append("text")
          .attr("class", "axis-title")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .attr("fill", "#5D6971")
          .text("Population)");






})
