d3.csv("/DataVizDashboard/javascript/profit_by_genre.csv").then(function(dataset) 
	{
		const dimensions = {
			width: 800,
			height: 400,
			margin: {
				top: 40,
				right: 15,
				bottom: 50,
				left: 115,
			},
		}

		const svg = d3.select("#q3scatterplot")
			.style("width", dimensions.width)
			.style("height", dimensions.height)

		const colors = ["red", "blue", "green", "orange", "purple", 
							"maroon", "brown", "steelblue", "pink", "black", 
							"gray", "aquamarine", "coral", "darkgoldenrod", "darkseagreen",
							"greenyellow", "olive", "indigo", "lavender", "mediumslateblue"]

		//budget is X
 		var xScale = d3.scaleLinear()
								.domain(d3.extent(dataset, d => +d.bud))
								.range([dimensions.margin.left, dimensions.width-dimensions.margin.right])
 
 		//revenue is Y
  		var yScale = d3.scaleLinear()
								.domain(d3.extent(dataset, d => +d.rev))
								.range([dimensions.height - dimensions.margin.top, dimensions.margin.bottom])

		console.log(d3.extent(dataset, d => +d.bud))

		var dots = svg.append("g")
								.selectAll("circle")
								.data(dataset)
								.enter()
								.append("circle")
								.attr("cx", d => xScale(d.bud))
								.attr("cy", d => yScale(d.rev))
								.attr("r", 5)
								.attr("fill", function(d, i){return colors[i]})

		const xAxis = d3.axisBottom().scale(xScale)
		const xAxisGroup = svg.append("g")
										.call(xAxis)
										.style("transform", `translateY(${dimensions.height - dimensions.margin.bottom*0.8}px`)
										.attr("color", "black")

		const yAxis = d3.axisLeft().scale(yScale)
		const yAxisGroup = svg.append("g")
										.call(yAxis)
										.style("transform", `translateX(${dimensions.margin.left}px`)
										.attr("color", "black")

		svg.append("text")
			.text("Budget")
			.attr("x", dimensions.width / 2)
			.attr("y", dimensions.height - 5)
			.attr("text-anchor", "middle")
			.attr("font-size", "14px")

		svg.append("text")
			.text("Revenue")
			.attr("x", -dimensions.height / 2)
			.attr("y", dimensions.margin.left / 3)
			.attr("text-anchor", "middle")
			.attr("font-size", "14px")
			.attr("transform", "rotate(-90)")

      const legend = d3.select("#q3legend")
									.style("width", dimensions.width)
									.style("height", dimensions.height/6)

		var rects = legend.append("g")
									.selectAll("rect")
									.data(dataset)
									.enter()
									.append("rect")
									.attr("y", 0)
									.attr("x", function(d, i){return dimensions.width*i/20})
									.attr("width", 18)
									.attr("height", 18)
									.attr("fill", function(d, i){return colors[i]})
	
   	var labels = legend.append("g")
									.selectAll("text")
									.data(dataset)
									.enter()
									.append("text")
									.style("font-size", "7px")
									.attr("y", dimensions.height/12)
									.attr("x", function(d, i){return dimensions.width*i/20})
									.text(d => d.primary_genre)
	}
)
