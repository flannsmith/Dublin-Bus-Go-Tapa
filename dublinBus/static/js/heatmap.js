let heatMapPaths = [];
let allCircles = [];
// avg dwell time is 10.38
// min is 0 and max is 1150 lol
// min lateness -916.6654135338346
// max lateness 1523.9270833333333
// acg ateness 106.57340983308887
// min travel time 2.033333333333333
// max travel time 1435.2527777777777
// avg travel time 69.07126959260705
function initMap (){

    console.log('hello')
    
    map = new google.maps.Map(document.getElementById('map'), {
        center:{lat:53.3498,lng:-6.2603},
        zoom: 15,
       });
    for (var stop in heatMap){
        console.log(stop);
        let stop_heat_data = heatMap[stop];
        let stop_data = stops[stop];
    //create a marker
        createMarkerWindow(stop_heat_data,stop_data,stop);

    //draw the links
    drawLinks(stop,stop_heat_data);

    }
}
function createMarkerWindow(stop_heat_data,stop_data,stop){
//create markers and windows. Color the markers according to average dwell time
    let location = {

        lat: stop_data.lat,
        lng: stop_data.lon,
    };

    let dwelltime = stop_heat_data['dwelltime'];
    console.log(dwelltime);
    let color;
    if (dwelltime < 10.0){
    color = 'green';
    }
    else if (dwelltime <30){
    color = 'blue';
    }
    else {
    color = 'red';
    }

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
        title: stop_data.stop_name,
    })
	allCircles.push(stopCircle);

}
function drawLinks(stop1,stopdata){
// draw the links showing either lateness, or average travel time
    tostops = stopdata['tostops'];
    for (stop2 in tostops){
    
    let traveltime = tostops[stop2]['trvl'];
    let color;
    console.log('travel',traveltime)
    if (traveltime < 60){
        color = 'green';

    }
    else if (traveltime < 100){ 
        color = 'blue';

    }
    else {
    color = 'red';

    }
    
        drawLink(stop1,stop2,color);
    }

    
}

function drawLink(stop1,stop2,color){

    heatpatharr = [
    {lat:parseFloat(stops[stop1]['lat']),lng:parseFloat(stops[stop1]['lon'])},
    {lat:parseFloat(stops[stop2]['lat']),lng:parseFloat(stops[stop2]['lon'])}
    ];
    let heatpath = new google.maps.Polyline({
                path: heatpatharr,
                geodesic: true,
                strokeColor: color,
                strokeOpacity: 1.0 ,
                strokeWeight: 2
              });

    heatMapPaths.push(heatpath);
    heatMapPaths[heatMapPaths.length-1].setMap(map);


}


