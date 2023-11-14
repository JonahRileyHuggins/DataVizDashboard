/*
    **q2.js**
    Visual script
    Answer the following question: How does the profitability of a film relate to the viewer ratings of the film?
*/
d3.json("data/revenue_by_rating_and_genre.json").then(function(data) {
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

  // console.log(data)

  // Indexing rating values
const ratingIndex = data.map(item => value(item, 'average_revenue'));

console.log("Rating values index:", ratingIndex);
  const series = d3.stack()
    .keys(d3.union(data.map(d => d.genre))) // apples, bananas, cherries, …
    .value(data, d => d.average_revenue)
  (d3.index(data, d => d.rating, d => d.genre));

 console.log(series)



  // Define the x and y axes
  const svg = d3.select("#barchart")
    .style("width", dimensions.width + "px")
    .style("height", dimensions.height + "px");

  // Extract all genres from the data
  const genres = Array.from(new Set(data.map(d => d.genres)));

  // Define a color scale for the genres
  const colorScale = d3.scaleOrdinal()
    .domain(genres)
    .range(d3.schemeCategory10);

  // Define the x-axis scale for ratings
  const xScale = d3.scaleBand()
    .domain([0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]) // Set the domain to numerical ratings
    .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => +d.revenue)])
    .nice()
    .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top]);

  // Create the x-axis
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + (dimensions.height - dimensions.margin.bottom) + ")")
    .call(d3.axisBottom(xScale));

  // Create the y-axis
  svg.append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(" + dimensions.margin.left + ",0)")
    .call(d3.axisLeft(yScale));

  // Create the stacked bars
  svg.selectAll(".bar")
    .data(Array.from(data.keys()))
    .enter().append("g")
    .attr("class", "bar")
    .attr("fill", d => colorScale(d))
    .selectAll("rect")
    .data(d => genres.map(genre => ({
      rating: d,
      genre: genre,
      value: data.get(d).get(genre) || 0,
    })))
    // .enter().append("rect")
    // .attr("x", d => xScale(d.rating))
    // .attr("y", d => yScale(d.value))
    // .attr("height", d => yScale(d.value))
    // .attr("width", xScale.bandwidth());

  // 

});