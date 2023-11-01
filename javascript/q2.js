/*
    **q2.js**
    Visual script
    Answer the following question: How does the profitability of a film relate to the viewer ratings of the film?
*/

// Assuming you have loaded the data from 'revenueVsratings.csv' into a variable 'data'

// Set the dimensions and margins for the plot
const margin = { top: 20, right: 30, bottom: 40, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Append an SVG element to your HTML
const svg = d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Scale for the x-axis (revenue)
const xScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.revenue)])
  .range([0, width]);

// Scale for the y-axis (ratings)
const yScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.rating)])
  .range([height, 0]);

// Create circles for each data point
svg.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d.revenue))
  .attr("cy", d => yScale(d.rating))
  .attr("r", 5)
  .attr("fill", "blue");

// Add x-axis
svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(xScale));

// Add y-axis
svg.append("g")
  .call(d3.axisLeft(yScale));

// Add axis labels
svg.append("text")
  .attr("x", width / 2)
  .attr("y", height + 30)
  .style("text-anchor", "middle")
  .text("Revenue");

svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -height / 2)
  .attr("y", -40)
  .style("text-anchor", "middle")
  .text("Ratings");
