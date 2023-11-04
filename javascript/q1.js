/*
    **q1.js**
    Visual script
    Answer the following question: How has the gross revenue of the film industry changed over time with regards to genre, actor, or director?
*/

d3.csv("/DataVizDashboard/data/movies_metadata.csv").then(
    function(dataset){
        
        //Sort data by year
        const sort_data = dataset.sort(function(x,y){
            return d3.ascending(x.release_year, y.release_year)
        });

        //Aggregate data by year
        const rev_data = d3.rollup(sort_data, (v) => d3.sum(v, (d) => +d.revenue), (d) => d.release_year);

        const dimensions = {
            width: 800,
            height: 400,
            margin: {
              top: 40,
              right: 15,
              bottom: 50,
              left: 115,
            },
          };

        //Create svg
        const svg = d3.select('#q1canvas')
                      .style('width', dimensions.width)
                      .style('height', dimensions.height);

        //Define axis scales
        const xScale = d3.scaleTime()
                         .domain(d3.extent(dataset, function(d) { return new Date(d.release_date); }))
                         .range([ dimensions.margin.left, dimensions.width - dimensions.margin.right])
     
         const yScale = d3.scaleLinear()
                          .domain([0, d3.max(rev_data, function(d) { return +d[1]; })])
                          .nice()
                          .range([ dimensions.height-dimensions.margin.bottom,  dimensions.margin.top]);
     
        //Create axes
        const tickSize = 10;
        const minYear = d3.min(rev_data, function(d) { return +d[0] })
        const tickMin = minYear + tickSize - minYear%tickSize;
        const maxYear = d3.max(rev_data, function(d) { return +d[0] })
        const tickMax = maxYear - maxYear%tickSize;
        const tickVals = Array.from({length: (tickMax - tickMin)/ tickSize + 1}, (value, index) => new Date(tickMin + index*tickSize, 0 , 1));
        const xAxis = d3.axisBottom(xScale).tickValues(tickVals);
        const xAxisGroup = svg.append("g")
                              .call(xAxis)
                              .style("transform", `translateY(${dimensions.height - dimensions.margin.bottom}px)`)
                              .attr("color", "black");

        const yAxis = d3.axisLeft(yScale);
        const yAxisGroup = svg.append("g")
                              .call(yAxis)
                              .style("transform", `translateX(${dimensions.margin.left}px`)
                              .attr("color", "black");
                     
         // Add the line
        const line = svg.append("path")
                        .datum(rev_data)
                        .attr("fill", "none")
                        .attr("stroke", "blue")
                        .attr("stroke-width", 1.5)
                        .attr("d", d3.line()
                                     .x(function(d) { return xScale(new Date(d[0])) })
                                     .y(function(d) { return yScale(d[1]) })
                             );
        
              // Add X-axis label
        svg.append("text")
            .text("Release Year")
            .attr("x", dimensions.width / 2)
            .attr("y", dimensions.height - 10) // Adjust the Y position
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .attr("fill", "black");

        // Add Y-axis label
        svg.append("text")
           .text("Total Revenue")
           .attr("x", -dimensions.height / 2) // Rotate the text for vertical orientation
           .attr("y", 15) // Adjust the Y position
           .attr("text-anchor", "middle")
           .attr("font-size", "14px")
           .attr("fill", "black")
           .attr("transform", "rotate(-90)"); // Rotate the text for vertical orientation
    }
)