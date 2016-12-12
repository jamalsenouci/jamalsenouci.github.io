var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    padding = 0.3;

var yoyx = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(padding);

var yoyy = d3.scaleLinear()
    .range([height, 0]);

var yoyxaxis = d3.axisBottom()
    .scale(yoyx);

var yoyyaxis = d3.axisLeft()
    .scale(yoyy)
    .tickFormat(function(d) { return dollarFormatter(d); });

var chart = d3.select("#yoy")
    .append("svg:svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("/public/runningtotal/data/yoy.csv", type, function(error, data) {

  // Transform data (i.e., finding cumulative values and total) for easier charting
  var cumulative = 0;
  for (var i = 0; i < data.length; i++) {
    data[i].start = cumulative;
    cumulative += data[i].value;
    data[i].end = cumulative;

    data[i].class = ( data[i].value >= 0 ) ? 'positive' : 'negative'
  }
  data.push({
    name: '2016 Revenue',
    end: cumulative,
    start: 0,
    class: 'total'
  });
console.log(data)

  yoyx.domain(data.map(function(d) { return d.name; }));
  yoyy.domain([0, d3.max(data, function(d) { return d.end; })]);

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, 450)")
      .call(yoyxaxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yoyyaxis);

  var bar = chart.selectAll(".bar")
      .data(data)
    .enter().append("g")
      .attr("class", function(d) { return "bar " + d.class })
      .attr("transform", function(d) { return "translate(" + yoyx(d.name) + ",0)"; });

  bar.append("rect")
      .attr("y", function(d) { return yoyy( Math.max(d.start, d.end) ); })
      .attr("height", function(d) { return Math.abs( yoyy(d.start) - yoyy(d.end) ); })
      .attr("width", yoyx.bandwidth());

  bar.append("text")
      .attr("x", yoyx.bandwidth() / 2)
      .attr("y", function(d) { return yoyy(d.end) + 5; })
      .attr("dy", function(d) { return ((d.class=='negative') ? '-' : '') + ".75em" })
      .text(function(d) { return dollarFormatter(d.end - d.start);});

  bar.filter(function(d) { return d.class != "total" }).append("line")
      .attr("class", "connector")
      .attr("x1", yoyx.bandwidth() + 5 )
      .attr("y1", function(d) { return yoyy(d.end) } )
      .attr("x2", yoyx.bandwidth() / ( 1 - padding) - 5 )
      .attr("y2", function(d) { return yoyy(d.end) } )
});

function type(d) {
  d.value = +d.value;
  return d;
}

function dollarFormatter(n) {
  n = Math.round(n);
  var result = n;
  if (Math.abs(n) > 1000) {
    result = Math.round(n/1000) + 'K';
  }
  return '$' + result;
}
