//store API endpoint as query
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let myMap = L.map ("map", {
    center:[37.09, -95.71],
    zoom:5,
    //layers: [streetmap, earthquakes]

});
function chooseColor(depth){
    
    if(depth <10){
        return "#ffffcc";
    } else if(depth < 30){
        return "#a1dab4";
    } else if(depth < 50){
        return "#41b6c4";
    } else if(depth < 70){
        return "#2c7b8";
    } else if(depth < 90){
        return "#253494";
    } else {
        return "#081d58";


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
        //function createcircleMarker(feature,latlng){
            return L.circleMarker(latlng, {
            radius: feature.properties.mag*5,
            fillcolor:chooseColor(feature.properties.mag),
            color:chooseColor(feature.properties.mag),
            weight:0.25,
            opacity:0.5,
            fillOpacity:0.8
            });
        //};
        }
    }).addTo(myMap);
    console.log(earthquakeData)
    //Create variable for earthquakes
    //let earthquakes = L.geoJSON(earthquakeData, {
    // onEachFeature: onEachFeature,
    // pointToLayer:createcircleMarker

    //});
    //send layer to create leaflet map funtion
    createMap(earthquakes);

    //};


    // Defining function
    function createMap(earthquakes) {
        let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(myMap);
        
    //    let basemaps = L.tileLayer(
    //         "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'",
    //         {
    //           attribution:
    //             'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    //         });


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
    const grades = [ '0,10,30,50,70,90'];
    const labels =[];
    let from, to;

    // for (let i =0; <grades.length; i++){
    //     from = grades[i];
    //     to =grades[i +1];
    // }

   legendInfo= "<h4>Earthquake\'s </h4><hr>";

   div.innerHTML= legendInfo;

   grades.forEach((item, index) =>{
      return div.innerHTML +=
       '<i style="background:'+ chooseColor(item +1)+ ';"></i>&nbsp;'+
      item +(grades[index +1]? '&nbsp;&ndas;&nbsp;' +grades[index +1]+'<br>':'+')


   });

 return div;

 };


 legend.addTo(myMap);


