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

  var svg = d3.select("#barchart")
    .style("width", dimensions.width + "px")
    .style("height", dimensions.height + "px");


  var xScale = d3.scaleBand()
    .domain(d3.map(data, d => +d.rating))
    .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])
    .padding(0.2)

  var keys = data.columns.slice(2);

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


  var genres = ["Action","Adventure","Animation","Comedy","Crime",
              "Documentary","Drama","Family","Fantasy","Foreign",
              "History","Horror","Music","Mystery","Romance",
              "Science Fiction","TV Movie","Thriller","War","Western"];

  
  const colors = ["red", "blue", "green", "orange", "purple", 
							"maroon", "brown", "steelblue", "pink", "black", 
							"gray", "aquamarine", "coral", "darkgoldenrod", "darkseagreen",
							"greenyellow", "olive", "indigo", "lavender", "mediumslateblue"]

  var stackedData = d3.stack()
    .keys(keys)
    (data)


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
    .attr("stroke", "white")
      //Our new hover effects
      //Our new hover effects
    .on('mouseover', function (d, i) {
      d3.select(this).transition()
            .duration('50')
            .attr('opacity', '.85')})
    .on('mouseout', function (d, i) {
        d3.select(this).transition()
              .duration('50')
              .attr('opacity', '1')})

      // Add x-axis
  svg.append("g")
    .attr("transform", "translate(20," + (dimensions.height - dimensions.margin.bottom) + ")")
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
    // .attr("y", 0 - dimensions.margin.left)
    .attr("y", 50 - (dimensions.margin.left /2))
    .attr("x", 0 - (dimensions.height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Average Revenue");

// Click event for 'female' button
  d3.select('#female').on("click", function () {
    var fem = data.filter(function (d) {
      return d.gender === " Female";
    });

    var stackedFemaleData = d3.stack()
      .keys(keys)
      (fem);
    
    // removing the previous bars
    svg.selectAll("g")
      .remove()

    // Update the existing bars
    var bars = svg.append("g")
      .selectAll("g")
      .data(stackedFemaleData)
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
      .attr("stroke", "white")
      //Our new hover effects
      .on('mouseover', function (d, i) {
        d3.select(this).transition()
              .duration('50')
              .attr('opacity', '.85')})
      .on('mouseout', function (d, i) {
          d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1')})

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
        .attr("x", 0 - (dimensions.height / 2 ))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Total Revenue");
  })


  // Time to add in the male data
  d3.select('#male').on("click", function(){
    var men = data.filter(function(d){
      return d.gender ===" Male"
    })
    var stackedMaleData = d3.stack()
      .keys(keys)
      (men)

    // removing the previous bars
    svg.selectAll("g")
      .remove()

    // Update the existing bars
    var bars = svg.append("g")
      .selectAll("g")
      .data(stackedMaleData)
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
      .attr("stroke", "white")
      //Our new hover effects
      .on('mouseover', function (d, i) {
        d3.select(this).transition()
              .duration('50')
              .attr('opacity', '.85')})
      .on('mouseout', function (d, i) {
          d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1')})

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
        .attr("x", 0 - (dimensions.height / 2 ))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Total Revenue");
  })


  // Now creating a function to return it to the combined data. 
  d3.select('#combined').on("click", function(){

    var stackedData = d3.stack()
      .keys(keys)
      (data)

    // removing the previous bars
    svg.selectAll("g")
      .remove()

    // Update the existing bars
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
      .attr("stroke", "white")
            //Our new hover effects
      .on('mouseover', function (d, i) {
        d3.select(this).transition()
              .duration('50')
              .attr('opacity', '.85')})
      .on('mouseout', function (d, i) {
          d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1')})

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
        .attr("x", 0 - (dimensions.height / 2 ))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Total Revenue");

  })


});