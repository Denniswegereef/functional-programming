//width and height
var w = 600
var h = 400
var padding = 40

var dataset = []
dataset.push([46, 32])
dataset.push([47, 31])
dataset.push([51, 41])
dataset.push([52, 38])
dataset.push([38, 29])
dataset.push([1, 1])

//scale function
var xScale = d3
  .scaleLinear()
  //.domain(["Alabama","Alaska","Arizona","Arkansas","California"])
  .domain([
    0,
    d3.max(dataset, function(d) {
      return d[0]
    })
  ])
  //.range([padding, w-padding * 2]);
  .range([padding, w - padding * 2])

var yScale = d3
  .scaleLinear()
  .domain([
    0,
    d3.max(dataset, function(d) {
      return d[1]
    })
  ])
  //.range([padding, w-padding * 2]);
  .range([h - padding, padding])

var xAxis = d3
  .axisBottom()
  .scale(xScale)
  .ticks(5)

var yAxis = d3
  .axisLeft()
  .scale(yScale)
  .ticks(5)

//create svg element
var svg = d3
  .select('body')
  .append('svg')
  .attr('width', w)
  .attr('height', h)

svg
  .selectAll('circle')
  .data(dataset)
  .enter()
  .append('circle')
  .attr('cx', function(d) {
    return xScale(d[0])
  })
  .attr('cy', function(d) {
    return h - yScale(d[1])
  })
  .attr('r', 5)
  .attr('fill', 'green')

//x axis
svg
  .append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0,' + (h - padding) + ')')
  .call(xAxis)

//y axis
svg
  .append('g')
  .attr('class', 'y axis')
  .attr('transform', 'translate(' + padding + ', 0)')
  .call(yAxis)
