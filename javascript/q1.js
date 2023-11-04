/*
    **q1.js**
    Visual script
    Answer the following question: How has the gross revenue of the film industry changed over time with regards to genre, actor, or director?
*/

d3.csv("/DataVizDashboard/data/movies_metadata.csv").then(
    function(dataset){
        var dimensions = {
            width: 800,
            height: 400,
            margin:{
                top: 20,
                bottom: 30,
                right: 20,
                left: 50
            }
        };

        //Create svg
        const svg = d3.select('#q1canvas')
                      .append('svg')
                      .attr('width', dimensions.width)
                      .attr('height', dimensions.height);
        /*
        //Ensure year and revenue are numbers
        dataset.forEach(function(d) {
            d.release_year = +d.release_year;
            d.revenue = +d.revenue;
        });
        
        //Axis scales
        const xScale = d3.scaleLinear()
                         .domain(d3.extent(dataset, d => d.release_year))
                         .range([dimensions.margin.left, dimensions.width - dimensions.margin.right]);
        
        const yScale = d3.scaleLinear()
                         .domain([0, d3.max(dataset, d => d.revenue)])
                         .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top]);
        
        //Create a line
        const line = d3.line()
                       .x(d => xScale(d.release_year))
                       .y(d => yScale(d.revenue));
        
        //Create a path for the line
        const linepath = svg.append("path")
                            .datum(dataset)
                            .attr('fill', 'none')
                            .attr('stroke', 'steelblue')
                            .attr('stroke-width', 2)
                            .attr('d', line);
            
        //Generate axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        //Add axes
        svg.append('g')
           .attr('class', 'x-axis')
           .attr('transform', `translate(0, ${dimensions.height - dimensions.margin.bottom})`)
           .call(xAxis);
        
        svg.append('g')
           .attr('class', 'y-axis')
           .attr('transform', `translate(${dimensions.margin.left}, 0)`)
           .call(yAxis);
        */
    }
)