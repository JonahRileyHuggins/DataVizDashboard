/*
    **q1.js**
    Visual script
    Answer the following question: How has the gross revenue of the film industry changed over time with regards to genre, actor, or director?
*/

d3.csv("data/movies_metadata.csv").then(
    function(dataset){
        
        var genres = ["Action","Adventure","Animation","Comedy","Crime",
                      "Documentary","Drama","Family","Fantasy","Foreign",
                      "History","Horror","Music","Mystery","Romance",
                      "Science Fiction","TV Movie","Thriller","War","Western"];

        const colors = ["red", "blue", "green", "orange", "purple", 
							"maroon", "brown", "steelblue", "pink", "black", 
							"gray", "aquamarine", "coral", "darkgoldenrod", "darkseagreen",
							"greenyellow", "olive", "indigo", "lavender", "mediumslateblue"]

        var genreColor = {}
        for(var i = 0; i < genres.length; i++){
            genreColor[genres[i]] = colors[i];
        }

        var genre_selected = "";

        //Sort data by year
        var sort_data = dataset.sort(function(x,y){
            return d3.ascending(x.release_year, y.release_year)
        });

        //Aggregate data by year and filter to date range
        const filterYearMin = 1930;
        const filterYearMax = 2016;
        sort_data = sort_data.filter((d) => {return (d.release_year >= filterYearMin && d.release_year <= filterYearMax)});
        //const rev_data = d3.rollups(sort_data, (v) => d3.sum(v, (d) => +d.revenue), (d) => d.release_year, (d) => d.genres.split(",")[0])
        //                   .flatMap((d) => {return d[1].map((a) => {return {"release_year":+d[0], "genre":a[0], "revenue":+a[1]}})});
        
        const rev_data = d3.rollups(sort_data, (v) => d3.count(v, (d) => d.release_year), (d) => d.release_year, (d) => d.genres.split(",")[0])
                           .flatMap((d) => {return d[1].map((a) => {return {"release_year":+d[0], "genre":a[0], "revenue":+a[1]}})});
                        

        var genre_rev = d3.group(rev_data, (d) => {return d.genre});
        
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
     
        //Create axes
        const tickSize = 10;
        const minYear = d3.min(rev_data, function(d) { return +d.release_year })
        const tickMin = minYear - minYear%tickSize;
        const maxYear = d3.max(rev_data, function(d) { return +d.release_year })
        const tickMax = maxYear - maxYear%tickSize;
        const tickVals = Array.from({length: (tickMax - tickMin)/ tickSize + 1}, (value, index) => new Date(tickMin + index*tickSize, 0 , 1));
        const xScale = d3.scaleTime()
                         .domain([new Date(`${minYear}` + '-01-01'), new Date(`${maxYear}` + '-12-31')])
                         .range([ dimensions.margin.left, dimensions.width - dimensions.margin.right]);
        const yScale = d3.scaleLinear()
                          .domain([0, d3.max(rev_data, function(d) { return +d.revenue; })])
                          .nice()
                          .range([ dimensions.height-dimensions.margin.bottom,  dimensions.margin.top]);

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
            
        //Add text
        var text = svg
                .append('text')
                .attr("id", 'topbartext')
                .attr("x", dimensions.width*0.75)
                .attr("y", dimensions.height*0.1)
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("font-family", "sans-serif")
                .text("");

        var line = svg.selectAll(".line")
                         .data(genre_rev)
                         .join("path")
                         .on("mouseover", function(d, i){
                            d3.select(this)
                                .attr("opacity", 0.5);
                            text.text(i[0]);
                          })
                         .on("mouseout", function(){
                            d3.select(this)
                                .attr("opacity", 1.0);
                            text.text("");
                          })
                         .on("click", (d,i) => {
                            d3.selectAll("#q1canvas, #barchart, #q3scatterplot")
                              .dispatch("genre_change", {detail: {genre: i[0]}});
                         })
                         .attr("fill", "none")
                         .attr("stroke", (d, i) => {return genreColor[d[0]]})
                         .attr("stroke-width", 3.0)
                         .attr("d", (d) => {return d3.line()
                                                     .x(function(d) { return xScale(new Date(`${d.release_year}`+'-12-31')) })
                                                     .y(function(d) { return yScale(d.revenue) })
                                                     (d[1])
                                           });
                        
        // Add X-axis label
        svg.append("text")
            .text("Release Year")
            .attr("x", dimensions.width / 2)
            .attr("y", dimensions.height - 10) // Adjust the Y position
            .attr("text-anchor", "middle")
            .attr("font-size", "24px")
            .attr("fill", "black");

        // Add Y-axis label
        svg.append("text")
           .text("Films Released")
           .attr("x", -dimensions.height / 2) // Rotate the text for vertical orientation
           .attr("y", 25) // Adjust the Y position
           .attr("text-anchor", "middle")
           .attr("font-size", "24px")
           .attr("fill", "black")
           .attr("transform", "rotate(-90)"); // Rotate the text for vertical orientation
    
        //Interaction listener
        svg.on("genre_change", (g) => {
            yScale.domain([0, d3.max(rev_data.filter((d)=>{return d.genre === g.detail.genre}), function(d) { return +d.revenue; })]);

            yAxisGroup.transition(100).call(yAxis);

            line.filter((d) => {return d[0] !== g.detail.genre})
                .transition().duration(100)
                .attr("stroke-width", 0.0)
            
            line.filter((d) => {return d[0] === g.detail.genre})
                .transition().duration(100)
                .attr("stroke-width", 3.0)
                .attr("d", (d) => {return d3.line()
                    .x(function(d) { return xScale(new Date(`${d.release_year}`+'-12-31')) })
                    .y(function(d) { return yScale(d.revenue) })
                    (d[1])
                });
        });

        d3.selectAll(".legend-button").on("click", (b) => {
            yScale.domain([0, d3.max(rev_data.filter((d)=>{return d.genre === b.target.textContent}), function(d) { return +d.revenue; })]);

            yAxisGroup.transition(100).call(yAxis);

            line.filter((d) => {return d[0] !== b.target.textContent})
                .transition().duration(100)
                .attr("stroke-width", 0.0)
            
            line.filter((d) => {return d[0] === b.target.textContent})
                .transition().duration(100)
                .attr("stroke-width", 3.0)
                .attr("d", (d) => {return d3.line()
                    .x(function(d) { return xScale(new Date(`${d.release_year}`+'-12-31')) })
                    .y(function(d) { return yScale(d.revenue) })
                    (d[1])
                });
        });

        d3.select("#clear").on("click", (b) => {
            yScale.domain([0, d3.max(rev_data, function(d) { return +d.revenue; })])

            yAxisGroup.transition(100).call(yAxis);
            
            line.transition().duration(100)
                .attr("stroke-width", 3.0)
                .attr("d", (d) => {return d3.line()
                    .x(function(d) { return xScale(new Date(`${d.release_year}`+'-12-31')) })
                    .y(function(d) { return yScale(d.revenue) })
                    (d[1])
                });
        });
    }
)