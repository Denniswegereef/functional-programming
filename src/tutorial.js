// GROUPBY
// 2008
//
var svg = d3.select("#buildings")
    .append("svg")
    .attr("width", "400")
    .attr("height", "400");

d3.json("buildings.json").then(data => {
    console.log(data);

    data.forEach(building => {
        building.height = Number(building.height)
    });

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, 400])
        .paddingInner(0.1)
        .paddingOuter(0.1)

    const yScale = d3.scaleLinear()
          .domain([0, d3.max(data, d => d.height)])
          .range([0, 400]);

    const rects = svg.selectAll("rect")
        .data(data)
        .enter()
          .append("rect")
          .attr("y", 0)
          .attr("x", building => xScale(building.name))
          .attr("width", xScale.bandwidth)
          .attr("height", building => yScale(building.height))
          .attr("fill", "grey")
});
