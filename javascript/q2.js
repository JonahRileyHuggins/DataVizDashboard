/*
    **q2.js**
    Visual script
    Answer the following question: How does the profitability of a film relate to the viewer ratings of the film?
*/

// Load the CSV data
d3.csv('data/q2_data.csv').then(function(data) {

  var dimensions = {
    width: 800,
    height: 400,
    margin: {
      top: 50,
      right: 10,
      bottom: 50,
      left: 10,
      }
    }

  var svg = d3.select("#barchart")
    .style("width", dimensions.width + "px")
    .style("height", dimensions.height + "px");

  var tooltip = d3.select("barchart")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var xScale = d3.scaleBand()
    .domain(d3.map(data, d => +d.rating))
    .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])
    .padding(0.2)

  var keys = data.columns.slice(2);
  console.log(keys)

  var maximum = d3.max(data, function (d){ 
    var sumName = 0
    for (var i = 0; i < keys.length; i++) {
      sumName = sumName + parseFloat(d[keys[i]])
    }
    return sumName
  })

  var yScale = d3.scaleLinear()
    .domain([0, maximum])
    .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top]);
  console.log(yScale)

  var colorScale = d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeCategory10)

  var stackedData = d3.stack()
    .keys(keys)
    (data)
  
  // console.log(d3.select(this).datum().key

  // var mouseover = function(d) {
  //   var subgroupName = d3.select(this).datum().key;
  //   var reversedKeys = keys.reverse(); // Reverse the keys here
  //   var subgroupValue = d.data[reversedKeys[0]]; // Use reversed key to access data
  //   tooltip
  //       .html("subgroup: " + subgroupName + "<br>" + "Value: " + subgroupValue)
  //       .style("opacity", 1);
  // }
    
    var mousemove = function(d) {
      tooltip
        .style("left", (d3.pointer(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
        .style("top", (d3.pointer(this)[1]) + "px")
    }
    var mouseleave = function(d) {
      tooltip
        .style("opacity", 0)
    }


  var bars = svg.append("g")
    .selectAll("g")
    .data(stackedData)
    .enter()
    .append("g")
    .attr("fill", d => colorScale(d.key))
    .selectAll("rect")
    .data(function (d) {return d;})
    .enter()
    .append("rect")
    .attr("x", d => xScale(+d.data.rating))
    .attr("y", d => yScale(+d[1]))
    .attr("height", d => yScale(+d[0]) - yScale(+d[1]))
    .attr("width", d => xScale.bandwidth())
    .attr("stroke", "white")
    .on("mouseover", function(d) {
      d3.select(this)
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      var subgroupName = d3.select(this.parentNode).datum().key;
      var subgroupValue = d.data[subgroupName];
      tooltip
          .html("subgroup: " + subgroupName + "<br>" + "Value: " + subgroupValue)
          .style("opacity", 1);
      

    })
    .on("mouseout", function(d) {
      d3.select(this)
      .attr("stroke", "with")
      .attr("stroke-width", 0)
    })


      // Add x-axis
  svg.append("g")
    .attr("transform", "translate(0," + (dimensions.height - dimensions.margin.bottom) + ")")
    .call(d3.axisBottom(xScale));

  // Add y-axis
  svg.append("g")
    .attr("transform", "translate(" + dimensions.margin.left + ",0)")
    .call(d3.axisLeft(yScale));

  // Add x-axis label
  svg.append("text")
    .attr("transform", "translate(" + (dimensions.width / 2) + " ," +
      (dimensions.height - dimensions.margin.bottom + 40) + ")")
    .style("text-anchor", "middle")
    .text("Rating");

  // Add y-axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - dimensions.margin.left)
    .attr("x", 0 - (dimensions.height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Total Revenue");


  var legend = svg.append("g")
    .attr("transform", "translate(" + (dimensions.width - dimensions.margin.right - 100) + "," + dimensions.margin.top + ")")
    .selectAll(".legend")
    .data(keys.reverse()) // Reverse the order to match the color scale
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
    .attr("x", 0)
    .attr("width", 9)
    .attr("height", 9)
    .style("fill", colorScale);

  legend.append("text")
    .attr("x", 25)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(function (d) { return d; });

  });
