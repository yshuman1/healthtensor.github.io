(function() {
  var svg = d3.select("#phys-time"),
      legendHeight = 100,
      width = util.parsePxStr(svg.style("width")),
      height = util.parsePxStr(svg.style("height")),
      radius = Math.min(width, height) / 2,
      pieHeight = height - legendHeight,
      g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + pieHeight / 2 + ")");

  // var color = d3.scaleOrdinal(["#98abc5", "#ff8c00", "#7b6888", "#d0743c", "#a05d56", "#8a89a6", "#6b486b"]);
  var color = d3.scaleLinear().domain([16, 58])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#0000FF"), d3.rgb('#FF0000')]);

  var pie = d3.pie()
    .sort(null)
      .padAngle(0.1)
    .value(function(d) { return d.time; });

  var path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 90);

  var label = d3.arc()
    .outerRadius(radius - 50)
    .innerRadius(radius - 50);

  var legendScaleY = d3.scaleLinear()
      .domain([0, 2])
      .range([pieHeight + 20, height - 20]);

  d3.csv("assets/data/phystime.csv", function(error, data) {
    if (error) throw error;

    var arc = g.selectAll(".arc")
        .data(pie(data))
      .enter().append("g")
      .attr("class", "arc");

    arc.append("path")
      .attr("d", path)
      .attr("fill", function(d) { return color(d.data.time); });

    arc.append("text")
      .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
      .attr("dy", "0.35em")
      .text(function(d) { return d.data.time + "%"; });

    var legend = svg.selectAll(".legend-label")
        .data(data)
        .enter().append("g")
        .attr("class", "legend-label");

    legend.append("rect")
      .attr("x", 60)
      .attr("y", function(d, i) { return legendScaleY(i) - 14; })
      .attr("width", 16)
      .attr("height", 16)
      .style("fill", function(d) { return color(d.time); });

    legend.append("text")
      .attr("x", 88)
      .attr("y", function(d, i) { return legendScaleY(i); })
      .text(function(d) { return d.cat; });
  });
})();
