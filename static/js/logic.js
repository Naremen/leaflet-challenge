//map layer
// Creating our initial map object:
// We set the longitude, latitude, and starting zoom level.
// This gets inserted into the div with an id of "map".
let myMap = L.map("map", {
    center: [38.5, -98.00],
    zoom: 5
});

// Adding a tile layer (the background map image) to our map:
// We use the addTo() method to add objects to our map.
let earthquakes = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// use d3 to import the data
let challengeq = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(challengeq).then(function (data) {
    console.log("web data", data)

    function magnitude(params) {
        if (params == 0) {
            return 1;
        }
        return params * 3;

    }

    function coloring(params) {
        switch (true) {
            case params > 90:

                return "red";
            case params > 70:

                return "orange";
            case params > 50:

                return "yellow";
            case params > 30:

                return "green";
            case params > 10:

                return "blue";

            default: 
                return "purple";
        }

    }
    function styleInfo(feature) {
        return {
            color: "red",
            radius: magnitude(feature.properties.mag),
            fillColor: coloring(feature.geometry.coordinates[2]),
            fillOpacity: 1
        }

    }




    // circle markers from data
    // size depends on magnitude
    // need the lat and long of eq
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },


        style: styleInfo,
        onEachFeature: function (feature, layer) {
            console.log("feature")


        }
    }).addTo(myMap);

    // earthquake layer





    // legend
    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'legend');

        // loop through our density intervals and generate a label with a colored square for each interval
        for (let i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<i style="background:' + coloring(i) + '"></i> ' +
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }

        return div;
    }

    legend.addTo(myMap);



});