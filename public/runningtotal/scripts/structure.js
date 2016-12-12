var width = 400;
var height = 400;

var structureVis = d3.select("#structure").append("svg:svg")
    .attr("width", width)
    .attr("height", height)

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    structg = structureVis.append("svg:g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
    width = +structureVis.attr("width") - margin.left - margin.right,
    height = +structureVis.attr("height") - margin.top - margin.bottom;

structg.append("rect")
    .attr("x",70 )
    .attr("y", 0 )
    .attr("height", 50)
    .attr("width", 150)
    .attr("fill","steelblue")
    .attr("class", "serie")
.on("click", function(){console.log("clicked")});

structg.append("text")
  .text("Customer Base")
  .attr("x",95 )
  .attr("y", 30 )
  .attr("fill", "white");

structg.append("path")
  .attr("d", "M150 50 V 70 H 80 V100")
.attr("fill","transparent")
.attr("stroke","black");

structg.append("path")
  .attr("d", "M150 50 V 70 H 220 V100")
.attr("fill","transparent")
.attr("stroke","black");

structg.append("path")
  .attr("d", "M80 150 V 180 H 30 V200")
.attr("fill","transparent")
.attr("stroke","black");

structg.append("path")
  .attr("d", "M80 150 V 180 H 120 V200")
.attr("fill","transparent")
.attr("stroke","black");

structg.append("rect")
    .attr("x",30 )
    .attr("y", 100 )
    .attr("height", 50)
    .attr("width", 100)
    .attr("fill","steelblue")
    .attr("class", "serie");
structg.append("text")
  .text("Online")
  .attr("x",60 )
  .attr("y", 130 )
  .attr("fill", "white");

structg.append("rect")
    .attr("x",170 )
    .attr("y", 100 )
    .attr("height", 50)
    .attr("width", 100)
    .attr("fill","steelblue")
    .attr("class", "serie");
structg.append("text")
  .text("Offline")
  .attr("x",200 )
  .attr("y", 130 )
  .attr("fill", "white");

structg.append("rect")
    .attr("x",0 )
    .attr("y", 200 )
    .attr("height", 40)
    .attr("width", 70)
    .attr("fill","steelblue")
    .attr("class", "serie");
structg.append("text")
  .text("New")
  .attr("x",20 )
  .attr("y", 225 )
  .attr("fill", "white");

structg.append("rect")
    .attr("x",80 )
    .attr("y", 200 )
    .attr("height", 40)
    .attr("width", 70)
    .attr("fill","steelblue")
    .attr("class", "serie");
structg.append("text")
  .text("Repeat")
  .attr("x", 93 )
  .attr("y", 225 )
  .attr("fill", "white");
