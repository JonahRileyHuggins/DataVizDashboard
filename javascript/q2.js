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
      top: 50,
      right: 5,
      bottom: 50,
      left: 60,
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
});




// d3.csv("javascript/average_revenue_by_rating.csv").then(function(data) {
//   console.log(data);
//   // Define dimensions
//   const dimensions = {
//   width: 800,
//   height: 400,
//   margin: {
//       top: 20,
//       right: 5,
//       bottom: 20,
//       left: 60,
//       },
//     };

//   // Append an SVG element to your HTML
//   const svg = d3.select("#barchart")
//     .style("width", dimensions.width)
//     .style("height", dimensions.height)

//   const xAccessor = d => d.rating;
//   const yAccessor = d => d.revenue;
    

//   const xScale = d3.scaleLinear()
//     .domain(d3.extent(data,xAccessor))
//     .range([dimensions.margin.left,dimensions.width-dimensions.margin.right])

//   const yScale = d3.scaleLinear()
//     .domain(d3.extent(data,yAccessor))
//     .range([dimensions.height-dimensions.margin.bottom,dimensions.margin.top])

// // Define dots to be plotted
//   // const dots = svg.append("g")
//   //   .selectAll("circle")
//   //   .data(data)
//   //   .enter()
//   //   .append("circle")
//   //   .attr("cx", d => xScale(xAccessor(d)))
//   //   .attr("cy", d => yScale(yAccessor(d)))
//   //   .attr("fill", "blue")
//   //   .attr("r", 3)

//   const rect = svg.append("g") 
//     .selectAll("rect")
//     .data(data)
//     .enter()
//     .append("rect")
//     .attr("x", d => xScale(xAccessor(d)))
//     .attr("y", d => yScale(yAccessor(d))
//     .attr("width", xScale.bandwidth())
//     .attr("height", d => height - yScale(d.value))
//     .attr("fill", "blue");


// // Define the x and y axes
//   const xAxis = d3.axisBottom().scale(xScale)
//   const xAxisGroup = svg.append("g")
//     .call(xAxis)
//     .style("transform", `translateY(${dimensions.height-dimensions.margin.bottom}px)`)
//     .attr("color", "black")

//   const yAxis = d3.axisLeft().scale(yScale)
//   const yAxisGroup = svg.append("g")
//     .call(yAxis)
//     .style("transform", `translateX(${dimensions.margin.left}px)`)
//     .attr("color", "black")

//   });
