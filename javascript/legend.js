// Colors and genres lists
var colors = ["red", "blue", "green", "orange", "purple", 
    "maroon", "brown", "steelblue", "pink", "black", 
    "gray", "aquamarine", "coral", "darkgoldenrod", "darkseagreen",
    "greenyellow", "olive", "indigo", "lavender", "mediumslateblue"];

var genres = ["Action", "Adventure", "Animation", "Comedy", "Crime",
    "Documentary", "Drama", "Family", "Fantasy", "Foreign",
    "History", "Horror", "Music", "Mystery", "Romance",
    "Science Fiction", "TV Movie", "Thriller", "War", "Western"];

// Get the legend container
var legendContainer = document.getElementById("legend");

// Create the legend items dynamically
for (var i = 0; i < genres.length; i++) {
    var legendItem = document.createElement("div");
    legendItem.className = "legend-item";

    var colorBox = document.createElement("div");
    colorBox.className = "color-box";
    colorBox.style.backgroundColor = colors[i];

    var genreText = document.createElement("span");
    genreText.textContent = genres[i];

    legendItem.appendChild(colorBox);
    legendItem.appendChild(genreText);
    legendContainer.appendChild(legendItem);
}
