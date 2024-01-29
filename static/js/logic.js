//store API endpoint as query
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let myMap = L.map ("map", {
    center:[37.09, -95.71],
    zoom:5,
    //layers: [streetmap, earthquakes]

});
function getColor(depth) {
    switch (true) {
      case depth > 90:
        return "#EA2C2C";
      case depth > 70:
        return "#EA822C";
      case depth > 50:
        return "#EE9C00";
      case depth > 30:
        return "#EECC00";
      case depth > 10:
        return "#D4EE00";
      default:
        return "#98EE00";
    }
  }

//Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
    console.log(data);
//pass the feautures to a createFeatures ()function:
    createFeatures(data);
});

function createFeatures(earthquakeData){
// set Marker color based in depth of earthquake

//Give each feature a Popup describing the place/time of the earthquake
    function onEachFeature(feature,layer){
        layer.bindPopup(`<h3>Where:${feature.properties.place}</hs><hr><p>Time: ${new Date(feature.properties.time)}<p>hr><p>Magnitude:${feature.properties.mag}<p><hr><p>Number of "Felt" Reports:${feature.properties.felt}`);

    }
   
    // Create a GeoJson Layer contaning the feature array on the earhtquakedata
    var earthquakes = L.geoJSON(earthquakeData, {

        onEachFeature,

        pointToLayer:function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 5,
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: getColor(feature.properties.mag),
                weight: 1,
                opacity: 0.5,
                fillOpacity: 1 
            });
        
        }
    }).addTo(myMap);
    console.log(earthquakeData)   
    
    //send layer to create leaflet map funtion
    createMap(earthquakes);
    // Defining function
    function createMap(earthquakes) {
        let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(myMap);
        
    

        //Create base layers
    let baseMaps = {
        "Street scale":streetmap


        };
    // Create an Overlay object
    let overlayMaps = { 
        Earthquakes: earthquakes
    };


    //create layer control & add to map
    //Pass BaseMaps and overlayMaps
    L.control.layers(baseMaps, overlayMaps).addTo(myMap,{
        collapsed:false

    });

    }

};
// //create legend
 const legend = L.control({position: 'bottomright'});

 legend.onAdd= function(){
    const div = L.DomUtil.create('div','info legend');
    const grades = [ '0','10','30','50','70','90'];
    let colors = [
        "#98EE00",
        "#D4EE00",
        "#EECC00",
        "#EE9C00",
        "#EA822C",
        "#EA2C2C"
      ];


   legendInfo= "<h4>Earthquake\'s </h4><hr>";
// white background for legend
   div.innerHTML= legendInfo;
   for (let i = 0; i < grades.length; i++) {
    div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
      + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }
  return div;
};



 legend.addTo(myMap);


