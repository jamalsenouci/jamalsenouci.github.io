var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%H:%M:%S");

var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);


var actual = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });


var counterfactual = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.open); });


var incremental = d3.area()
    .x(function(d, i) { return x(d.date); })
    .y0(function(d) { return y(d.open); })
    .y1(function(d) { return y(d.close); });

d3.csv("/public/runningtotal/data/lift.csv", function(d) {
  d.date = parseTime(d.date);
  d.close = +d.close;
  return d;
}, function(error, data) {
  if (error) throw error;

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain(d3.extent(data, function(d) { return d.close; }));

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .style("text-anchor", "end")
      .text("Web Visits");

g.append("g")
.attr("class", "label")
    .append("line")
      .attr("transform", "translate(0, -200)")
      .attr("y1", 650)
      .attr("y2", 200)
      .attr("x1", 455)
      .attr("x2", 455)
      .attr("stroke", "gray")
      .attr("stroke-dasharray", "5 5");

    d3.select(".label").append("text")
      .attr("transform", "translate(450, 0)")
      .attr("fill", "#393939")
      .style("text-anchor", "end")
      .text("Spot Airing Time");


  g.append("path")
      .datum(data)
      .attr("class", "actual")
      .attr("d", actual);

  g.append("path")
      .datum(data)
      .attr("class", "counterfactual")
      .attr("d", counterfactual);

  g.append("path")
      .datum(data)
      .attr("class", "incremental")
      .attr("d", incremental);
});
