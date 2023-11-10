/*
    **q2.js**
    Visual script
    Answer the following question: How does the profitability of a film relate to the viewer ratings of the film?
*/
d3.csv("data/revenueVsRatings.csv").then(function(data) {
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

  // Create a nested structure grouped by rating and genre
  const nestedData = d3.group(data, d => +d.rating, d => d.genre);

  // Calculate the average revenue for each genre within each rating group
  const averageRevenues = new Map();

  // Loop through each rating group
  for (const [rating, genreMap] of nestedData) {
    const genreAverages = new Map();

    // Loop through each genre within the rating group
    for (const [genre, movies] of genreMap) {
      // Calculate the average revenue for the genre
      const totalRevenue = d3.sum(movies, d => +d.revenue);
      console.log(totalRevenue)
      const averageRevenue = totalRevenue / movies.length;
      console.log(averageRevenue)
      // Store the average revenue for the genre
      genreAverages.set(genre, averageRevenue);
      console.log(genreAverages)
    }

    // Store the genre averages for the rating group
    averageRevenues.set(rating, genreAverages);

  }

  const flattenedData = Array.from(averageRevenues).flatMap(([rating, genreAverages]) => {
    return Array.from(genreAverages).map(([genre, value]) => {
      return {
        rating: rating,
        genre: genre,
        revenue: value
      };
    });
  });
  const filteredData = flattenedData.filter(entry => entry.genre !== "");

  const cleanedData = filteredData.map(entry => ({
    rating: parseFloat(entry.rating),
    genre: entry.genre,
    revenue: parseFloat(entry.revenue),
  }));
  console.log(cleanedData)


  const genreKeys = filteredData.map(entry => entry.genre);
  const keys = [...new Set(genreKeys)];
  console.log(keys)

  // const stackedData = d3.stack()
  // .keys(keys) // Extract keys from the dataset excluding the first two (genre and id)
  // .value(([, group], key) => group.get(key).revenue)
  // (d3.index(cleanedData, d => d.rating, d => d.genre));
  // console.log(stackedData)


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
    .domain([0, d3.max(filteredData, d => +d.revenue)])
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
    .data(Array.from(averageRevenues.keys()))
    .enter().append("g")
    .attr("class", "bar")
    .attr("fill", d => colorScale(d))
    .selectAll("rect")
    .data(d => genres.map(genre => ({
      rating: d,
      genre: genre,
      value: averageRevenues.get(d).get(genre) || 0,
    })))
    // .enter().append("rect")
    // .attr("x", d => xScale(d.rating))
    // .attr("y", d => yScale(d.value))
    // .attr("height", d => yScale(d.value))
    // .attr("width", xScale.bandwidth());

  // ... (You can add legends or other chart elements as needed)

});

