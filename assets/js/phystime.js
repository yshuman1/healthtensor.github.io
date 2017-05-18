(function() {
  var svg = d3.select("#phys-time"),
      legendHeight = 100;

  var color = d3.scaleLinear().domain([0, 2])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#00006F"), d3.rgb("#BF0020")]);

  var pie = d3.pie()
    .sort(null)
      .padAngle(0.1)
    .value(function(d) { return d.time; });


  function redraw(data) {
    /* Hack to remove all elements and start from scratch rather than data-joining */
    svg.selectAll("g").remove();
    var bound = svg.node().getBoundingClientRect(),
        width = Math.floor(bound.width),
        height = Math.floor(bound.height),
        pieHeight = height - legendHeight,
        radius = Math.min(width, pieHeight) / 2,
        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + pieHeight / 2 + ")");

    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 90);

    var label = d3.arc()
        .outerRadius(radius - 50)
        .innerRadius(radius - 50);

    var legendScaleY = d3.scaleLinear()
        .domain([0, 2])
        .range([pieHeight + 20, height - 20]);

    var arc = g.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
      .attr("class", "arc");

    arc.append("path")
      .attr("d", path)
      .attr("fill", function(d, i) { return color(i); });

    arc.append("text")
      .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
      .attr("dy", "0.35em")
      .text(function(d) { return d.data.time + "%"; });

    var legend = svg.selectAll(".legend-label")
      .data(data)
      .enter().append("g")
      .attr("class", "legend-label");

    legend.append("rect")
      .attr("x", width / 5 - 10)
      .attr("y", function(d, i) { return legendScaleY(i) - 14; })
      .attr("width", 16)
      .attr("height", 16)
      .style("fill", function(d, i) { return color(i); });

    legend.append("text")
      .attr("x", width / 5 + 16)
      .attr("y", function(d, i) { return legendScaleY(i); })
      .text(function(d) { return d.cat; });
  }

  d3.csv("assets/data/phystime.csv", function(error, data) {
    if (error) throw error;
    redraw(data);
    window.addEventListener("resize", function() { redraw(data); });
  });

})();
