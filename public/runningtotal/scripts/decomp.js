var width = 950;
var height = 400;

var vis = d3.select("#decomp").append("svg:svg")
    .attr("width", width)
    .attr("height", height)

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    g = vis.append("svg:g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
    width = +vis.attr("width") - margin.left - margin.right,
    height = +vis.attr("height") - margin.top - margin.bottom;

var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal(d3.schemeCategory10);

var stack = d3.stack();

/*
var area = d3.area()
    .x(function(d, i) { return x(d.data.date); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); });
*/

d3.csv("/public/runningtotal/data/decomp.csv", type, function(error, data) {
  if (error) throw error;

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
  z.domain(data.columns.slice(1));

  g.selectAll(".serie")
    .data(stack.keys(data.columns.slice(1))(data))
    .enter().append("g")
      .attr("class", "serie")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.date); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", 16);

/*
  var keys = data.columns.slice(1);
  stack.keys(keys);

  var layer = g.selectAll(".layer")
     .data(stack(data))
     .enter().append("g")
       .attr("class", "layer");

   layer.append("path")
       .attr("class", "area")
       .style("fill", function(d) { return z(d.key); })
       .attr("d", area);

   layer.filter(function(d) { return d[d.length - 1][1] - d[d.length - 1][0] > 0.01; })
     .append("text")
       .attr("x", width - 6)
       .attr("y", function(d) { return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2); })
       .attr("dy", ".35em")
       .style("font", "10px sans-serif")
       .style("text-anchor", "end")
       .text(function(d) { return d.key; });
*/

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(3, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks(10).pop()))
      .attr("dy", "0.35em")
      .attr("text-anchor", "start")
      .attr("fill", "#000")
      .text("Sales");
});
/**/

function type(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;

  var parseTime = d3.timeParse("%d-%b-%Y");
  d.date = parseTime(d.date);

  return d;
}
