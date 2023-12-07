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
      top: 10,
      right: 0,
      bottom: 50,
      left: 110,
      }
    }


  // Plot specifics block  
  var svg = d3.select("#barchart")
    .style("width", dimensions.width + "px")
    .style("height", dimensions.height + "px");

  const genres = ["Action","Adventure","Animation","Comedy","Crime",
      "Documentary","Drama","Family","Fantasy","Foreign",
      "History","Horror","Music","Mystery","Romance",
      "Science Fiction","TV Movie","Thriller","War","Western"];

  const colors = ["red", "blue", "green", "orange", "purple", 
      "maroon", "brown", "steelblue", "pink", "black", 
      "gray", "aquamarine", "coral", "darkgoldenrod", "darkseagreen",
      "greenyellow", "olive", "indigo", "lavender", "mediumslateblue"]

  var genreColor = {};
  for (var i = 0; i < genres.length; i++) {
  genreColor[genres[i]] = colors[i];
  }
  
  // Data processing block
  var keys = data.columns.slice(2);

  var maximum = d3.max(data, function (d){ 
    var sumName = 0
    for (var i = 0; i < keys.length; i++) {
      sumName = sumName + parseFloat(d[keys[i]])
    }
    return sumName
  })

  var stackedData = d3.stack()
  .keys(keys)
  (data)

  //Defining Text Block
  var text = svg.append("text")
    .attr("id", 'descriptionText')
    .attr("x", dimensions.width*0.75)
    .attr("y", dimensions.height*0.1)
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("font-family", "sans-serif")
    .text("");


  // Plotting block
  var xScale = d3.scaleBand()
  .domain(d3.map(data, d => +d.rating))
  .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])
  .padding(0.2)

  xAxis = d3.axisBottom().scale(xScale);
  const xAxisGroup = svg.append("g")
      .call(xAxis)
      .attr("transform", `translate(0, ${dimensions.height - dimensions.margin.bottom})`)
      .attr('color', 'black');

  var yScale = d3.scaleLinear()
    .domain([0, maximum])
    .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top]);

  yAxis = d3.axisLeft().scale(yScale);
  const yAxisGroup = svg.append("g")
      .call(yAxis)
      .style("transform", `translateX(${dimensions.margin.left}px`)
      .attr("color", "black");



  // Stacked Bars block
  var bars = svg.append("g")
    .selectAll("g")
    .data(stackedData)
    .enter()
    .append("g")
    .attr("fill", function(d, i){return colors[i]})
    .selectAll("rect")
    .data(function (d) {return d;})
    .enter()
    .append("rect")
    .attr("x", d => xScale(+d.data.rating))
    .attr("y", d => yScale(+d[1]))
    .attr("height", d => yScale(+d[0]) - yScale(+d[1]))
    .attr("width", d => xScale.bandwidth())
    .on('mouseover', function (d, i) {
      d3.select(this)
            .attr('opacity', .5);
            text.text(i[1] - i[0]);
    })
    .on('mouseout', function (d, i) {
        d3.select(this)
              .attr('opacity', '1');
              text.text("");
    })
    .on('click', (d, i) => {
      console.log(i)
      d3.selectAll("#q1canvas")
        .dispatch("genre_change", {detail: {genre: i[0]}});
      d3.select('#barchart')
        .dispatch("genre_change", {detail: {genre: i[0]}});
    });

// Legend block
  // Add x-axis label
  svg.append("text")
    .text("Rating")
    .attr("x", dimensions.width / 2)
    .attr("y", dimensions.height -5)
    .attr("text-anchor", "middle")
    .attr("font-size", "24px");

  // Add y-axis label
  svg.append("text")
    .text("Average Revenue")
    .attr("x", -dimensions.height / 2)
    .attr("y", dimensions.margin.left / 3.6)
    .attr("text-anchor", "middle")
    .attr("font-size", "24px")
    .attr("transform", "rotate(-90)");



// Functionality displaying genres on click
  svg.on("genre_change", (g) => {
    xScale = d3.scaleBand()
      .domain(d3.map(data, d => +d.rating))
      .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])
      .padding(0.2)

    yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => +d[g.detail.genre]))
      .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top]);

    yAxis = d3.axisLeft().scale(yScale);
    xAxis = d3.axisBottom().scale(xScale);
    yAxisGroup.transition(100).call(yAxis);
    xAxisGroup.transition(100).call(xAxis); 

    bars.remove();

    bars = svg.append("g")
      .selectAll("rect")
      .data(data, d => d[g.detail.genre])
      .enter()
      .append("rect")
      .attr("x", d => xScale(+d.rating))
      .attr("y", d => yScale(+d[g.detail.genre]))
      .attr("height", d => yScale(0) - yScale(+d[g.detail.genre]))
      .attr("width", d => xScale.bandwidth())
      .attr("fill", genreColor[g.detail.genre]);

  });
    

// Functionality for the buttons. 
  d3.selectAll('.legend-button').on("mousedown", (b) => {
    var genre = b.target.textContent;

     xScale = d3.scaleBand()
      .domain(d3.map(data, d => +d.rating))
      .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])
      .padding(0.2)

    yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => +d[genre]))
      .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top]);

    yAxis = d3.axisLeft().scale(yScale);
    xAxis = d3.axisBottom().scale(xScale);
    yAxisGroup.transition(100).call(yAxis);
    xAxisGroup.transition(100).call(xAxis); 

    bars.remove();

    bars = svg.append("g")
      .selectAll("rect")
      .data(data, d => d[genre])
      .enter()
      .append("rect")
      .attr("x", d => xScale(+d.rating))
      .attr("y", d => yScale(+d[genre]))
      .attr("height", d => yScale(0) - yScale(+d[genre]))
      .attr("width", d => xScale.bandwidth())
      .attr("fill", genreColor[genre]);
  });


  // Functionality for the clear button
  d3.select('#clear').on("mousedown", (b) => {

    text.text("");

    xScale = d3.scaleBand()
      .domain(d3.map(data, d => +d.rating))
      .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])
      .padding(0.2)

    yScale = d3.scaleLinear()
      .domain([0, maximum])
      .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top]);
    
    yAxis = d3.axisLeft().scale(yScale);
    xAxis = d3.axisBottom().scale(xScale);
    yAxisGroup.transition(100).call(yAxis);
    xAxisGroup.transition(100).call(xAxis);

    bars.remove();

    bars = svg.append("g")
      .selectAll("g")
      .data(stackedData)
      .enter()
      .append("g")
      .attr("fill", function(d, i){return colors[i]})
      .selectAll("rect")
      .data(function (d) {return d;})
      .enter()
      .append("rect")
      .attr("x", d => xScale(+d.data.rating))
      .attr("y", d => yScale(+d[1]))
      .attr("height", d => yScale(+d[0]) - yScale(+d[1]))
      .attr("width", d => xScale.bandwidth())
      .on('mouseover', function (d, i) {
        d3.select(this)
              .attr('opacity', .5);
              text.text(i[0]);
      })
      .on('mouseout', function (d, i) {
          d3.select(this)
                .attr('opacity', '1');
                text.text("");
      })
      .on('click', (d, i) => {
        d3.selectAll("#q1canvas")
          .dispatch("genre_change", {detail: {genre: i[0]}});
        d3.select('#barchart')
          .dispatch("genre_change", {detail: {genre: i[0]}});
      });
  });
});