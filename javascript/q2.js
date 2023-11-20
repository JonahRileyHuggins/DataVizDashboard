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
      right: 50,
      bottom: 50,
      left: 50,
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

  var colorScale = d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeCategory10)

  var stackedData = d3.stack()
    .keys(keys)
    (data)

  var Tooltip = d3.select("#barchart")
    .append("svg")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    Tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  
  var mousemove = function(d, i) {
    var key = keys[i]; // Get the key for the current bar
    Tooltip
    d3.select(this)
        .html("Genre: " +  key) // Update the tooltip content with the key
        .style("left", (d3.pointer(this)[0] + 70) + "px")
        .style("top", (d3.pointer(this)[1]) + "px");
  }

  var mouseleave = function(d) {
    Tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
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
    //Our new hover effects
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

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
    .attr("x", 0 - (dimensions.height / 2 + 10 ))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Total Revenue");

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
        .attr("x", 0 - (dimensions.height / 2 + 10 ))
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
        .attr("x", 0 - (dimensions.height / 2 + 10 ))
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
        .attr("x", 0 - (dimensions.height / 2 + 10 ))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Total Revenue");

  })


  //   //Legend Stuff 
  // var legend = svg.append("g")
  //   .attr("transform", "translate(" + (dimensions.width - dimensions.margin.right - 100) + "," + dimensions.margin.top + ")")
  //   .selectAll(".legend")
  //   .data(keys.reverse()) // Reverse the order to match the color scale
  //   .enter().append("g")
  //   .attr("class", "legend")
  //   .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

  // legend.append("rect")
  //   .attr("x", 0)
  //   .attr("width", 9)
  //   .attr("height", 9)
  //   .style("fill", colorScale);

  // legend.append("text")
  //   .attr("x", 25)
  //   .attr("y", 9)
  //   .attr("dy", ".35em")
  //   .style("text-anchor", "start")
  //   .text(function (d) { return d; });

  });