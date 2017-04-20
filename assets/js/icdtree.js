/**
 * Module for rendering ICD tree graph.
 **/

(function() {
  function project(x, y) {
    var angle = (x - 90) / 180 * Math.PI, radius = y;
    return [radius * Math.cos(angle), radius * Math.sin(angle)];
  }

  var svg = d3.select("#icdtree"),
      radius = 600;
      width = +svg.attr("width"),
      height = +svg.attr("height"),
      g = svg.append("g").attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

  var stratify = d3.stratify()
      .id(function(d) { return d.code; })
      .parentId(function(d) { return d.parent; });

  var tree = d3.tree()
    .size([360, radius])
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

  var color = d3.scaleLinear().domain([0, 360])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);

  var alpha = d3.scaleLinear().domain([0, radius])
      .range([1, 0.1]);

  d3.csv('assets/data/ICD10_tree.csv', function(error, data) {
    var root = tree(stratify(data));

    var link = g.selectAll(".link")
        .data(root.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .style("stroke", function(d) { return color(d.x); })
        .style("stroke-opacity", function(d) { return alpha(d.y); })
        .attr("d", function(d) {
          return "M" + project(d.x, d.y)
            + "C" + project(d.x, (d.y + d.parent.y) / 2)
            + " " + project(d.parent.x, (d.y + d.parent.y) / 2)
            + " " + project(d.parent.x, d.parent.y);
        });

    var node = g.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function(d) { return "translate(" + project(d.x, d.y) + ")"; })
        .on("mouseover", function() {
          amplitude.getInstance().logEvent('icdtree.hover');
          svg.classed("pause-rotate", true);
        })
      .on("mouseout", function() { svg.classed("pause-rotate", false); });

    node.append("circle")
      .style("fill", function(d) { return color(d.x); })
      .style("fill-opacity", function(d) { return d.data.descr ? alpha(d.y) : 0; })
      .attr("r", function(d) { return d.data.descr ? 5 : 0; })
      .append("svg:title")
      .text(function(d) { return d.id + ': ' + d.data.descr; });

    // node.append("text")
    //   .attr("dy", ".31em")
    //   .attr("x", function(d) { return d.x < 180 === !d.children ? 6 : -6; })
    //   .style("text-anchor", function(d) { return d.x < 180 === !d.children ? "start" : "end"; })
    //   .attr("transform", function(d) { return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")"; })
    //   .text(function(d) { return d.depth > 0 && d.depth < 2 ? d.id : ''; });
  });

})();
