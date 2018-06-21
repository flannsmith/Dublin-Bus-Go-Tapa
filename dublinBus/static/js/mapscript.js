let allCircles = [];
var busPath;
let busPathArray = [];
var pathSet = false;
let currentRouteId = 15;
function initMap() {

    //initialize the map
    largeInfowindow = new google.maps.InfoWindow();

    // create new map object
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 53.3498, lng: -6.2603},

        zoom: 15,
    });
// create a marker and an info window for every stop
    for (var stop in stops){
        
      createMarkerInfoWindow(stops[stop],stop);

    }
//create the side bar buttons for selecting routes
createRouteButtons()
}

function createMarkerInfoWindow(stop,stopnumber){
///draw circles for every bus station
    let location = {
        
        lat: stop.lat,
        lng: stop.lon,
    };

    var color = 'blue';

// define the circle
    let stopCircle = new google.maps.Circle({
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,

        fillOpacity: 0.35,
        map: map,
        center: location,
        radius: 15,
        title: stop.stop_name,
    })
/// add the event listener to open marker windows on click
    google.maps.event.addListener(stopCircle, 'click', function (ev) {
            populateInfoWindow(this, largeInfowindow, ev, stop,stopnumber);
    });

    allCircles.push(stopCircle);

  }

  function populateInfoWindow(circle, infowindow, ev, stop,stopnumber) {


  /// define the contents of the info window
    infowindow.setPosition(ev.latLng);



    infowindow.setContent(
        `<div class='infowindow'>

          <div class='name'>${stop.stop_name}</div>
          <div class='name'>${stopnumber}</div>
		        </div>`
    );
    infowindow.open(map);
// if the user clicks on this stop, draw all the routes that connect to it
	drawAllRoutes(stopnumber);
}

function drawAllRoutes(stopnumber){
	//first clear out any current routes
	if (pathSet){
	busPath.setMap(null);	
	}
	for (i in busPathArray){
	busPathArray[i].setMap(null)
	}
    //clear the busPathArray
	busPathArray = [];
    // for every route that matches this stop number, draw its path
	let routeids = stops_routes[stopnumber.toString()]
 	console.log(routeids);	
	for (var r in routeids){
	routeid = routeids[r];
	pathToDraw = routes[routeid][0];
	drawOneOfMultipleBusRoutes(pathToDraw); 
}
	
}
function drawOneOfMultipleBusRoutes(path){

let temp_path = [];
for (var i in path){
      //for ever stop in the path, add that stops coordinates to the path
      var stop = stops[path[i]]

      if (typeof stop != 'undefined'){

      temp_path.push({lat:parseFloat(stop['lat']),lng:parseFloat(stop['lon'])})
    }
    else{
      //raise an error messsage if a stop is missing
      console.log(path[i])
      console.log(stop)


}
}
temp_busPath = new google.maps.Polyline({
                path: temp_path,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0 ,
                strokeWeight: 2
              });
      //draw the bus path
      //store it in the busPathArray so that it can be deleted later
busPathArray.push(temp_busPath);
busPathArray[busPathArray.length-1].setMap(map)
}


function drawBusRoute(path){
  //clear the current busRoute, if there is one
    if (pathSet){
    busPath.setMap(null);
  }

    let bus_path = [];
    for (var i in path){
      //for ever stop in the path, add that stops coordinates to the path
      var stop = stops[path[i]]

      if (typeof stop != 'undefined'){

      bus_path.push({lat:parseFloat(stop['lat']),lng:parseFloat(stop['lon'])})
    }
    else{
      //raise an error messsage if a stop is missing
      console.log(path[i])
      console.log(stop)

    }
      }
      //define the bus path
      busPath = new google.maps.Polyline({
                path: bus_path,
                geodesic: true,
                strokeColor: 'blue',
                strokeOpacity: 1.0 ,
                strokeWeight: 3
              });
      //draw the bus path
      busPath.setMap(map)
      pathSet=true;
}

function createRouteButtons(){
    //create the sidebar route buttons for selecting routes
  HTML = '';
 for (route in routes){
   HTML += '<li style="cursor:pointer;" onclick="showVariations(\''+route.toString()+'\')" id="'+route.toString()+'"><p>'+route+'</p></li>'


 }
document.getElementById('scrollbar').innerHTML=HTML

}
function destroyRouteButtons(){
    //self explanatory
  document.getElementById('scrollbar.')
}

function showVariations(routeid){
    // when you click on a route button, you should see a selector for
    // every variation of that route
    //
    // first hide any variations that are already shown
  if (currentRouteId==routeid){
    hideVariations(routeid);
    return 0;
  }
  else {
    hideVariations(currentRouteId);
  }
  HTML='';
  count = 1
  for (variation in routes[routeid.toString()]){
    HTML+='<li style="cursor:pointer;" onclick="displayRouteById(\''+routeid+'\','+(count-1).toString()+ ')">Variation: '+count+'</li>';
    count+=1;

  }
  document.getElementById(routeid).innerHTML += HTML
  currentRouteId = routeid;
}

function hideVariations(routeid){
    //hide the variations currently shown
  document.getElementById(routeid).innerHTML="<p>"+routeid+"</p>";
  currentRouteId = 15;
}
function displayRouteById(routeid, count){
//draw a route, if it is selected
  routeToDraw = routes[routeid][count];
  drawBusRoute(routeToDraw);


}
