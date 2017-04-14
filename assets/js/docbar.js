/**
 * Module for rendering graph of physician documentation burden.
 **/

(function() {
  function parsePxStr(pxString) {
    if (pxString.indexOf('px') != pxString.length - 2) {
      throw 'px substring in unexpected location';
    }
    return Math.floor(Number(pxString.slice(0, pxString.length - 2)));
  }

  var svg = d3.select("svg"),
      margin = {top: 20, right: 20, bottom: 30, left: 40},
      data = [
        {label: 'Patient time', hours: 1},
        {label: 'Computer time', hours: 2}
      ];


  function redraw() {
    var width = parsePxStr(svg.style("width")) - margin.left - margin.right,
        height = +parsePxStr(svg.style("height")) - margin.top - margin.bottom,
        x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]);

    /* Hack to remove all elements and start from scratchrather than data-joining */
    svg.select("g").remove();
    var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(data.map(function(d) { return d.label; }));
    y.domain([0, d3.max(data, function(d) { return d.hours; })]);

    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(5))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Hours");

    g.selectAll(".bar").data(data, function(d) { return d.label; })
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.label); })
      .attr("y", function(d) { return y(d.hours); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.hours); });
  }

  redraw();
  window.addEventListener("resize", redraw);

})();
