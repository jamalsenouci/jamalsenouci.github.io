
var w = 900,
    h = 650,
    fill = d3.scale.category20();

function dblclick(d) {			//Double click fixes node, click or drag unfixes it
 d3.select(this).classed("fixed", d.fixed = (function(){
	 if (d.fixed == true){ return false; }
	 else return true;
 }));
}

function dragstart(d) {
  d3.select(this).classed("fixed", d.fixed = true);
}

var grav = 0.2;

var container = d3.select("#network")
  .append("svg:svg")
  .attr("width", w)
  .attr("height", h);

var force = d3.layout.force()
    .size([w, h])
	.charge(function(d){
		return(-10*(d.weight));	//Larger nodes repel more strongly
	})
	.friction(0.5)
    .linkDistance(function(d){		//Larger distance for start and conversion nodes to help keep them at graph edges
		if(d.source['id'] == 0 || d.target['id'] == 1){
			return 500;
			}
		else {
			return 400;
		}
	})
	.linkStrength(0.1)
	.gravity(grav)
	.theta(0.5)
	//.alpha(0);

var drag = force.drag()
    .on("dragstart", dragstart);

d3.json("/public/runningtotal/data/force.json", function(error, json) {
  if (error) throw error;

  force
      .nodes(json.nodes)
      .links(json.links)
      .start();

  var link = container.selectAll("line.link")
      .data(json.links)
    .enter().append("svg:line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return 10*d.weight; })
	  .style("stroke", function(d){
		  if(d.source.id != 0){
			return fill(d.source.grouping);
			}
		  else return "black";
	  })
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  var node = container.selectAll("circle.node")
      .data(json.nodes)
    .enter().append("svg:circle")
      .attr("class", "node")
      .attr("cx", function(d) {
		  if(d.id == 0){
			  //console.log("fixed");
			  d.x = -2000.0;
			  return d.x;
			  }
		  else if(d.id == 1){
			  d.x = 4000.0;
			  return d.x;
			  }
		  else
			  //console.log(d.x);
			  return d.grouping*20;
		  })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d){ return 100*Math.sqrt(d.weighting); })
      .style("fill", function(d) {
			if(d.id != 0 && d.id != 1){
				return fill(d.grouping);
			}
				else
					fill(d.grouping);
					return "black";
			})
      .on("dblclick", dblclick)
      .call(drag);

  node.append("svg:title")
      .text(function(d) { return d.name; });

  var text = container.selectAll("text.node")
      .data(json.nodes)
      .enter().append("text")
      .attr("dx", function(d){ return d.x;})
      .attr("dy", function(d){ return d.y;})
      .text(function(d){ return d.name; })
      .attr("font-size", "10px");




  container.style("opacity", 1e-6)
    .transition()
      .duration(1000)
      .style("opacity", 1);

  force.on("tick", function(e) {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    text.attr("dx", function(d){ return d.x + 20;})
        .attr("dy", function(d){ return d.y + 20;})


  });
});
