/*
    **q2.js**
    Visual script
    Answer the following question: How does the profitability of a film relate to the viewer ratings of the film?
*/


d3.csv("revenueVsRatings.csv").then(function(data) {
  // Define dimensions
  const dimensions = {
  width: 800,
  height: 400,
  margin: {
      top: 20,
      right: 5,
      bottom: 20,
      left: 60,
      },
    };
  

  // // Set the dimensions and margins for the plot
  // const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  // const width = 800 - margin.left - margin.right;
  // const height = 400 - margin.top - margin.bottom;

  // Append an SVG element to your HTML
  const svg = d3.select("#scatter-plot")
    .style("width", dimensions.width)
    .style("height", dimensions.height)

  const xAccessor = d => d.revenue;
  const yAccessor = d => d.rating;
    
    // .append("svg")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    // .append("g")
    // .attr("transform", `translate(${margin.left},${margin.top})`);

  const dots = svg.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(xAccessor(d)))
    .attr("cy", d => yScale(yAccessor(d)))
    .attr("fill", "black")
    .attr("r", 3)


  // Scale for the x-axis (revenue)
  // const xScale = d3.scaleLinear()
  //   .domain(d3.extend(data, xAccessor))
  //   .range([0, dimensions.width]);

  // // Scale for the y-axis (ratings)
  // const yScale = d3.scaleLinear()
  //   .domain(d3.extend(data, yAccessor)
  //   .range([dimensions.height, 0])

  // // Create circles for each data point
  // svg.selectAll("circle")
  //   .data(data)
  //   .enter()
  //   .append("circle")
  //   .attr("cx", d => xScale(d.revenue))
  //   .attr("cy", d => yScale(d.rating))
  //   .attr("r", 5)
  //   .attr("fill", "blue");

  // // Add x-axis
  // svg.append("g")
  //   .attr("transform", `translate(0, ${height})`)
  //   .call(d3.axisBottom(xScale));

  // // Add y-axis
  // svg.append("g")
  //   .call(d3.axisLeft(yScale));

  // // Add axis labels
  // svg.append("text")
  //   .attr("x", width / 2)
  //   .attr("y", height + 30)
  //   .style("text-anchor", "middle")
  //   .text("Revenue");

  // svg.append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("x", -height / 2)
  //   .attr("y", -40)
  //   .style("text-anchor", "middle")
  //   .text("Ratings");
  });
