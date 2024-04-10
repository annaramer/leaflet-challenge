// Use d3 to getthe USGS GeoJSON to get earthquake data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
    .then(data => {
        console.log("Earthquake data:", data);
        createEarthquakeVisualization(data);
    })
    .catch(error => console.error("Error fetching earthquake data:", error));

// Function to create the earthquake visualization
function createEarthquakeVisualization(earthquakeData) {
    console.log("Creating earthquake visualization with data:", earthquakeData);

    // Create a map
    let map = L.map('map').setView([37.09, -95.71], 4);

    // Add tile layer for map background
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
// Your data markers should reflect the magnitude of the earthquake by their size and the depth of the earthquake by color.
// Earthquakes with higher magnitudes should appear larger, and earthquakes with greater depth should appear darker in color.
    // Function to determine the color based on depth
    let getColor = depth => depth >= 90 ? '#ff7057' :
                                      depth >= 70 ? '#ffa466' :
                                      depth >= 50 ? '#ffe599' :
                                      depth >= 30 ? '#fdff46' :
                                      depth >= 10 ? '#c6ff48' :
                                                    '#a6ff79';

    // Function to determine the radius based on magnitude
    let getRadius = magnitude => magnitude * 3;

    // Loop through the earthquake data to create markers
    earthquakeData.features.forEach(feature => {
        let { mag, place } = feature.properties;
        let depth = feature.geometry.coordinates[2];
        let color = getColor(depth);
        let radius = getRadius(mag);

        //console.log("Creating marker for earthquake:", feature);

        L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            fillColor: color,
            fillOpacity: 0.8,
            color: '#000',
            weight: 1,
            radius: radius
        }).bindPopup(`<h3>Location: ${place}</h3><p>Magnitude: ${mag}<br>Depth: ${depth}</p>`).addTo(map);
    });

    // Create a legend
    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'info legend');
        let depthRanges = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];
        let colors = ['#a6ff79', '#c6ff48', '#fdff46', '#ffe599', '#ffa466', '#ff7057'];

        div.innerHTML = depthRanges.map((range, index) => `<div><i style="background:${colors[index]}"></i> ${range}</div>`).join('');

        return div;
    };

    legend.addTo(map);

    // Append CSS styles for the legend
    let style = document.createElement('style');
    style.innerHTML = `
        .legend {
            background-color: white;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
            font: 12px Arial, sans-serif;
        }
        .legend div {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .legend i {
            width: 20px;
            height: 20px;
            margin-right: 8px;
        }
    `;
    document.head.appendChild(style);
}
