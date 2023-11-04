/*
    **q2.js**
    Visual script
    Answer the following question: How does the profitability of a film relate to the viewer ratings of the film?
*/
d3.csv("javascript/average_revenue_by_rating.csv").then(function(data) {
  // Define dimensions
  const dimensions = {
    width: 800,
    height: 400,
    margin: {
      top: 40,
      right: 0,
      bottom: 50,
      left: 115,
    },
  };

  // Append an SVG element to your HTML
  const svg = d3.select("#barchart")
    .style("width", dimensions.width + "px")
    .style("height", dimensions.height + "px");

  // Define x and y accessors
  const xAccessor = d => d.rating;
  const yAccessor = d => d.revenue;

  // Create scales
  const xScale = d3.scaleBand()
    .domain(data.map(xAccessor))
    .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, yAccessor)])
    .nice()
    .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top]);

  // Create the bars
  const bars = svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => xScale(xAccessor(d)))
    .attr("y", d => yScale(yAccessor(d)))
    .attr("width", xScale.bandwidth())
    .attr("height", d => dimensions.height - dimensions.margin.bottom - yScale(yAccessor(d)))
    .attr("fill", "blue");

  // Define the x and y axes
  const xAxis = d3.axisBottom(xScale);
  const xAxisGroup = svg.append("g")
    .call(xAxis)
    .style("transform", `translateY(${dimensions.height - dimensions.margin.bottom}px)`)
    .attr("color", "black");

  const yAxis = d3.axisLeft(yScale);
  const yAxisGroup = svg.append("g")
    .call(yAxis)
    .style("transform", `translateX(${dimensions.margin.left}px`)
    .attr("color", "black");

      // Add X-axis label
  svg.append("text")
    .text("Rating")
    .attr("x", dimensions.width / 2)
    .attr("y", dimensions.height - 10) // Adjust the Y position
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("fill", "black");

// Add Y-axis label
  svg.append("text")
    .text("Average Revenue")
    .attr("x", -dimensions.height / 2) // Rotate the text for vertical orientation
    .attr("y", 15) // Adjust the Y position
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("fill", "black")
    .attr("transform", "rotate(-90)"); // Rotate the text for vertical orientation

});
