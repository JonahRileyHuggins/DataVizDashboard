//d3.csv("javascript/profit_by_genre.csv").then(function(dataset) 
d3.csv("data/movies_metadata.csv").then(function(dataset) 
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

		var datasetGenre = d3.group(dataset, (d) => {return d.genres.split(",")[0]})

		const svg = d3.select("#q3scatterplot")
			.style("width", dimensions.width)
			.style("height", dimensions.height)

		const genres = ["Action", "Adventure", "Animation", "Comedy", "Crime",
							"Documentary", "Drama", "Family", "Fantasy", "Foreign",
							"History", "Horror", "Music", "Mystery", "Romance",
							"Science Fiction", "TV Movie", "Thriller", "War", "Western"];

		const colors = ["red", "blue", "green", "orange", "purple", 
							"maroon", "brown", "steelblue", "pink", "black", 
							"gray", "aquamarine", "coral", "darkgoldenrod", "darkseagreen",
							"greenyellow", "olive", "indigo", "lavender", "mediumslateblue"]  

		var genreColor = {};
		for(var i = 0; i < genres.length; i++){
			genreColor[genres[i]] = colors[i];
		}
                             
		var datasetAvgRev = d3.rollup(dataset, v => d3.mean(v, d => d.revenue), (d) => d.genres.split(",")[0]);
		var datasetAvgBud = d3.rollup(dataset, v => d3.mean(v, d => d.budget), (d) => d.genres.split(",")[0]);

      var datasetAvg = [];        
      for(var i = 0; i < genres.length; i++)
			datasetAvg[i] = [genres[i], +datasetAvgBud.get(genres[i]), +datasetAvgRev.get(genres[i])];

		var genre_selected = "";

		//budget is X
 		var xScale = d3.scaleLinear()
								.domain(d3.extent(datasetAvg, d => +d[1]))
								.range([dimensions.margin.left, dimensions.width-dimensions.margin.right]);
 
 		//revenue is Y
  		var yScale = d3.scaleLinear()
								.domain(d3.extent(datasetAvg, d => +d[2]))
								.range([dimensions.height - dimensions.margin.top, dimensions.margin.bottom]);
       
		var text = svg.append("text")
								.attr("id", 'descriptionText')
								.attr("x", dimensions.width*0.18)
								.attr("y", dimensions.height*0.1)
								.attr("dx", "-.8em")
								.attr("dy", ".15em")
								.attr("font-family", "sans-serif")
								.text("");
		
		var tooltip = svg.append("text")
								.attr("id", 'descriptionText')
								.attr("x", dimensions.width*0.36)
								.attr("y", dimensions.height*0.1)
								.attr("dx", "-.8em")
								.attr("dy", ".15em")
								.attr("font-family", "sans-serif")
								.attr("font-size", "14px")
								.text("");

		var dots = svg.append("g")
								.selectAll("circle")
								.data(datasetAvg)
								.enter()
								.append("circle")
								.attr("cx", d => xScale(d[1]))
								.attr("cy", d => yScale(d[2]))
								.attr("r", 5)                   
								.on("mouseover", function(d, i){
									d3.select(this)
										.attr("opacity", .8)
										.attr("r", 8);
									text.text(i[0]);
								})
								.on("mouseout", function(){
									d3.select(this)
										.attr("opacity", 1)
										.attr("r", 5);
									text.text("");
								})
								.on("click", (d, i) => {
									text.text(i[0]);
									d3.selectAll("#q1canvas")
										.dispatch("genre_change", {detail: {genre: i[0]}});
									d3.selectAll("#barchart")
										.dispatch("genre_change", {detail: {genre: i[0]}});
									d3.selectAll("#q3scatterplot")
										.dispatch("genre_change", {detail: {genre: i[0]}});
								})                           
								.attr("fill", function(d, i){return genreColor[d[0]]});  

		var xAxis = d3.axisBottom().scale(xScale);
		const xAxisGroup = svg.append("g")
										.call(xAxis)
										.style("transform", `translateY(${dimensions.height - dimensions.margin.bottom*0.8}px`)
										.attr("color", "black");

		var yAxis = d3.axisLeft().scale(yScale);
		const yAxisGroup = svg.append("g")
										.call(yAxis)
										.style("transform", `translateX(${dimensions.margin.left}px`)
										.attr("color", "black");

		svg.append("text")
			.text("Budget")
			.attr("x", dimensions.width / 2)
			.attr("y", dimensions.height - 5)
			.attr("text-anchor", "middle")
			.attr("font-size", "24px");

		svg.append("text")
			.text("Revenue")
			.attr("x", -dimensions.height / 2)
			.attr("y", dimensions.margin.left / 3)
			.attr("text-anchor", "middle")
			.attr("font-size", "24px")
			.attr("transform", "rotate(-90)");

		svg.on("genre_change", (g) => {
		text.text(g.detail.genre);
      	xScale = d3.scaleLinear()
								.domain(d3.extent(datasetGenre.get(g.detail.genre), d => +d.budget))
								.range([dimensions.margin.left, dimensions.width-dimensions.margin.right]);
 
  			yScale = d3.scaleLinear()
								.domain(d3.extent(datasetGenre.get(g.detail.genre), d => +d.revenue))
								.range([dimensions.height - dimensions.margin.top, dimensions.margin.bottom]);

			yAxis = d3.axisLeft().scale(yScale);
			xAxis = d3.axisBottom().scale(xScale);
			yAxisGroup.transition(100).call(yAxis);
			xAxisGroup.transition(100).call(xAxis); 

         dots.remove();

         dots = svg.append("g")
								.selectAll("circle")
								.data(datasetGenre.get(g.detail.genre))
								.enter()
								.append("circle")
								.attr("cx", d => xScale(d.budget))
								.attr("cy", d => yScale(d.revenue))
								.attr("r", 5)
								.on("mouseover", function(d, i){
									d3.select(this)
										.attr("opacity", .8)
										.attr("r", 8);
									tooltip.text("\""+i.title+"\", "+i.release_date);
								})
								.on("mouseout", function(){
									d3.select(this)
										.attr("opacity", 1)
										.attr("r", 5);
									tooltip.text("");
								})
								.attr("fill", genreColor[g.detail.genre]); 
			});

		d3.selectAll('.legend-button').on("mouseup", (b) => {
			var genre = b.target.textContent;
			text.text(genre);
			xScale = d3.scaleLinear()
								.domain(d3.extent(datasetGenre.get(genre), d => +d.budget))
								.range([dimensions.margin.left, dimensions.width-dimensions.margin.right]);
 
  			yScale = d3.scaleLinear()
								.domain(d3.extent(datasetGenre.get(genre), d => +d.revenue))
								.range([dimensions.height - dimensions.margin.top, dimensions.margin.bottom]);

			yAxis = d3.axisLeft().scale(yScale);
			xAxis = d3.axisBottom().scale(xScale);
			yAxisGroup.transition(100).call(yAxis);
			xAxisGroup.transition(100).call(xAxis); 

         dots.remove();

         dots = svg.append("g")
								.selectAll("circle")
								.data(datasetGenre.get(genre))
								.enter()
								.append("circle")
								.attr("cx", d => xScale(d.budget))
								.attr("cy", d => yScale(d.revenue))
								.attr("r", 5)
								.on("mouseover", function(d, i){
									d3.select(this)
										.attr("opacity", .8)
										.attr("r", 8);
									tooltip.text("\""+i.title+"\", "+i.release_date);
								})
								.on("mouseout", function(){
									d3.select(this)
										.attr("opacity", 1)
										.attr("r", 5);
									tooltip.text("");
								})
								.attr("fill", genreColor[genre]); 

		});

		d3.select('#clear').on("mouseup", function() {

			text.text("");

			xScale = d3.scaleLinear()
								.domain(d3.extent(datasetAvg, d => +d[1]))
								.range([dimensions.margin.left, dimensions.width-dimensions.margin.right]);

			yScale = d3.scaleLinear()
								.domain(d3.extent(datasetAvg, d => +d[2]))
								.range([dimensions.height - dimensions.margin.top, dimensions.margin.bottom]);
          
			yAxis = d3.axisLeft().scale(yScale);
			xAxis = d3.axisBottom().scale(xScale);
			yAxisGroup.transition(100).call(yAxis);
			xAxisGroup.transition(100).call(xAxis);

			dots.remove();

         dots = svg.append("g")
								.selectAll("circle")
								.data(datasetAvg)
								.enter()
								.append("circle")
								.attr("cx", d => xScale(d[1]))
								.attr("cy", d => yScale(d[2]))
								.attr("r", 5)                   
								.on("mouseover", function(d, i){
									d3.select(this)
										.attr("opacity", .8)
										.attr("r", 8);
									text.text(i[0]);
								})
								.on("mouseout", function(){
									d3.select(this)
										.attr("opacity", 1)
										.attr("r", 5);
									text.text("");
								})
								.on("click", (d, i) => {
									text.text(i[0]);
									d3.selectAll("#q1canvas")
										.dispatch("genre_change", {detail: {genre: i[0]}});
									d3.selectAll("#barchart")
										.dispatch("genre_change", {detail: {genre: i[0]}});
									d3.selectAll("#q3scatterplot")
										.dispatch("genre_change", {detail: {genre: i[0]}});
								})                              
								.attr("fill", function(d, i){return genreColor[d[0]]});  
			
		});


	}
)
