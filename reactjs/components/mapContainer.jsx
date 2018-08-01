import React, { Component } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper, Polyline } from "google-maps-react";
//import {geolocated} from 'react-geolocated';
import Button_Icon_BlueSky from "../../dublinBus/static/images/Button_Icon_BlueSky.svg";
//import stops from './stops.js';
import LocationSearchInput from "./LocationSearchInput.jsx";

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    //Define all the  functions that are to be bound to this component. This is needed as when bable compiles all jsx files into one big bundle the browser will not be able define what "this" is related to. Doing these bindings configures it so the browser knows they are related to this compoent (class).
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onMapClicked = this.onMapClicked.bind(this);
  //  this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.setSearchInputElementReference = this.setSearchInputElementReference.bind(this);
    this.geocodeAddress = this.geocodeAddress.bind(this);
    this.requestLocation = this.requestLocation.bind(this);
    this.drawRoute = this.drawRoute.bind(this);
    this.routeFinder = this.routeFinder.bind(this);
    this.handleJourneyPlannerSubmit = this.handleJourneyPlannerSubmit.bind(this);
    this.changeMapState = this.changeMapState.bind(this);    

    //Set the state of the component, a dictionary of data we want to use/manipulate.
    this.state = {
      showingInfoWindow: false, //toggle info window
      activeMarker: {}, 
      selectedPlace: {},
      //Center - used to change the location of the map when a location is eneterd in search bar.
      center: {
        lat: 53.3082648,
        lng: -6.22363949999999,
      },
      zoom: 15,
      // searchName - used to display address of search to screen
      searchName: '',
      startLat: 0,
      startLon: 0,
      currentLocationLat: 53.3082648, //users current latitude, defaults to UCD
      currentLocationLon: -6.22363949999999,  //users current longitude, defaults to UCD
      alreadyRequestedlocation: false, //stops bug that browser keeps requesting user location
      routeCoordsBus: [], //array of bus route location objects to be drawn as polyline
      routeCoordsWalking: [], //array of walking location objects to be drawn as polyline
      destinationLat: 0.0, 
      destinationLng: 0.0,
      directionMarkers: null, //contianer for the array of marker objects on a given route
      polyline: null, //container for polyline objects for a given route.
      startMarker: null,
      endMarker: null,
    };
  }

  componentDidMount(){
    //Function that runs when componet "mounts" or binds to the actual DOM.
    this.geocoder = new google.maps.Geocoder();
  }


  onMarkerClick(props, marker, e) {
    //Function to control marker click event, sets active marker to the current clicked marker
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  onMapClicked(mapProps, map, clickEvent) {
    //Function to hide active marker when map clicked
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  }

  changeMapState(results, address, destinationMarker, lat, lng){
    this.setState({
          center : results, //chages center of map and center marker
          searchName : address, //chages search name <p> value
          zoom: 16,
          endMarker: destinationMarker,
          startMarker: null,
          destinationLat: lat,
          destinationLng: lng
        }
      );
  }

  //BELOW CODE IS NOW REDUNDANT AS WE ARE USING A REACT COMPONENT THAT CALLS THE GEOCODER API FOR US.
 
//  handleFormSubmit(submitEvent){
    //Function to gather form data and send to geocodeAddress funciton
  //  var e = null;
    //if (!this.props.route.sidebarOpen){
    //    this.props.onClick(e, this.refs.xButton);
    //}
    //this.props.showDirectionFromLocation();
    //submitEvent.preventDefault(); //prevents http request (page reloading) normal form behaviour
    //var address = this.searchInputElement.value; //gets form input value
     // address+=",ireland";  
      //this.geocodeAddress(address, (results) => {
      //console.log(results)
     // let addressEnd = ''; //store address here
      //results[0].address_components.map(names => { //loops through the array of addres components and adds to full address.
      //  addressEnd += names.short_name + ", "
     // })
     // let destinationMarker = <Marker
       //         id = "End Marker"
         //       position={{lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()}}
           //     title={addressEnd}
             //   name={addressEnd}
               // onClick={this.onMarkerClick}
        //      />
      //console.log(addressEnd);
      ///this.setState({
         // center : results[0].geometry.location, //chages center of map and center marker
          //searchName : addressEnd, //chages search name <p> value
          //zoom: 16,
          //endMarker: destinationMarker,
          //startMarker: null,
          //destinationLat: results[0].geometry.location.lat(),
          //destinationLng: results[0].geometry.location.lng()
       // }
      //);
      
      //let fromLocation=true;
      //this.routeFinder(address, fromLocation);
   // });  
//}

  handleJourneyPlannerSubmit(originName, startLat, startLng, destinationName, destLat, destLng, destLatLng){
    //Function to gather form data and send to geocodeAddress funciton
    this.props.reset();
   // this.geocodeAddress(start, (results) => {
     // let results1 = results;
     // let address1 = ''; //store address here
     // results1[0].address_components.map(names => { //loops through the array of addres components and adds to full address.
       //  address1 += names.short_name + ", "
     //  });
    let originMarker = <Marker
                id="Origin Marker"
                position={{lat: startLat, lng: startLng}}
                title={originName}
                name={originName}
                onClick={this.onMarkerClick}
              />
    //  this.geocodeAddress(stop, (results) => {
      //   let results2 = results;
        // let address2 = ''; //store address here
        // results2[0].address_components.map(names => { //loops through the array of addres components and adds to full address.
         //     address2 += names.short_name + ", "
      //   });
    let destinationMarker = <Marker
        id="End Marker"
        position={{lat: destLat, lng: destLng}}
        title={destinationName}
        name={destinationName}
        onClick={this.onMarkerClick}
     />
    this.setState({
        startMarker: originMarker,
        zoom: 16, 
        startLat: startLat,
        startLon: startLng,
        endMarker: destinationMarker,
        center : destLatLng, //chages center of map and center marker
        searchName : destinationName, //chages search name <p> value
        destinationLat: destLat,
        destinationLng: destLng
       }
    );
    let fromLocation=false;
    this.routeFinder(destinationName, fromLocation);
 }
    
  setSearchInputElementReference(inputReference){
    //function whos parameter is linked to the ref of the form input (ie. gets form input value and stores it.)
    this.searchInputElement = inputReference;
  }


  geocodeAddress(address, callback) {
    //function to find co-ordinates from given address -- DEPRECIATED NOT USED ANYMORE
    this.geocoder.geocode({ 'address': address }, function handleResults(results, status) {

      //if result is found do this
      if (status === google.maps.GeocoderStatus.OK) {
            console.log("geocodeAddress RESULTS:");
            console.log(results);
            callback(results); //used to exit function
         }

    //if no result is found do this
    this.setState({
      lat: 53.350140,
      lng: -6.266155
    });

  }.bind(this));
}

routeFinder(address, fromLocation){
  //Function that uses API calls to find a route for a user and display route to the map.
  
  let originLat = 0;
  let originLng = 0;
  if (fromLocation == true){
    originLat = this.state.currentLocationLat;
    originLng = this.state.currentLocationLon;
    if ( originLng < 0 ){
      originLng = originLng * -1;
    }
  } else {
    console.log("Setting seact origins");
    console.log(this.state.startLat);
    console.log(this.state.startLon);
    console.log(this.state.destinationLat);
    console.log(this.state.destinationLng);
    originLat = this.state.startLat;
    originLng = this.state.startLon;
    if ( originLng < 0 ){
      originLng = originLng * -1;
    }
  }
  const destLat = this.state.destinationLat; //sets destination to destinationLat and destinationLng we set in geocodeAddress fucntion.
  let destLng = this.state.destinationLng;
  if ( destLng < 0 ){
    destLng = destLng * -1; //Backend code can't handel negative value so need to change to positve.
  }
  
  //Block below is to get the current time of day in seconds from users device to be used in API call.
  let now = new Date();
  let midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,0,0);
  const timeInMilliseconds = now.getTime() - midnight.getTime();
  const timeInSeconds = timeInMilliseconds / 1000; // Slow can optimize this ^^, too many uneeded steps.
  
  let routeShape = {}; //holds all the direction objects
  let stops = []; //holds all markers for a route
  console.log("fetch('/api/routefinder/"+originLat+"/"+originLng+"/"+destLat+"/"+destLng+"/"+timeInSeconds+")");
  fetch('/api/routefinder/'+originLat+'/'+originLng+'/'+destLat+'/'+destLng+'/'+timeInSeconds) //API call
    .then((response) => response.json())
    .then((responseJson) => {
      
      //In the below block of code we loop through all the data and store each bus route and walking route (which contain location objects) in its own array which in turn are all stored in the routeShape object. From this then we have a route shape object that has all the sub journeys of a route (arrays) as properties.
      let isPreviousRouteWalking = false; 
      let arrayID = "";
      let notFirstStop = false;
      //CHANGE THIS make api "lng" not "lon" and this computation is undeeded
      responseJson.data.reverse(); //needed to reverse as API reutrns start as end CHANGE API?
      responseJson.data.map((stop) => { //Loops through the json directions data
        if (isPreviousRouteWalking && stop.route == "walking") {
          routeShape[arrayID].push({lat: stop.data.lat, lng: stop.data.lon});
        } else if (!isPreviousRouteWalking && stop.route != "walking") {
          routeShape[arrayID].push({lat: stop.data.lat, lng: stop.data.lon});
        } else {
          if (notFirstStop){
            routeShape[arrayID].push({lat: stop.data.lat, lng: stop.data.lon}); //Needed to connect between walking and bus routes
          }
          arrayID = stop.id;
          routeShape[arrayID] = [];
          routeShape[arrayID].push({color: stop.route});
          routeShape[arrayID].push({lat: stop.data.lat, lng: stop.data.lon});
          notFirstStop = true;
          if (stop.route == "walking"){
            isPreviousRouteWalking = true;
          } else {
            isPreviousRouteWalking = false;
          }
        }


        if ( stop.id == "end" || stop.id == "begin"){
          //do nothing already have stop and start markers
        } else {
          let stopTime = new Date(stop.time * 1000).toISOString().substr(11, 8); //gets predicted time "stop.time" which is in seconds and presents it in a readable date time.
          stops.push(
            <Marker
              position={{lat: stop.data.lat, lng: stop.data.lon}}
              title={stop.data.stop_name}
              name={stop.data.stop_name}
              time={stopTime}
              onClick={this.onMarkerClick}
              key={stop.id}
            />
          );
        }
      });
        
      console.log(stops);
      console.log(stops[stops.length -1]);  
      let lastMarker = stops[stops.length -1];
      let time = lastMarker.props.time;
      console.log(time);
      this.props.setTime(time);
 
      let directionsPolylines = [];
      for (var i in routeShape){
        if (routeShape[i][0].color == "walking"){
          directionsPolylines.push(
          <Polyline
          path={routeShape[i].slice(1,)}
          strokeColor="#ff0707"
          strokeOpacity={0.8}
          strokeWeight={2}
          key={i}/>
        );
        } else {
          directionsPolylines.push(
          <Polyline
          path={routeShape[i].slice(1,)}
          strokeColor="#0000FF"
          strokeOpacity={0.8}
          strokeWeight={2}
          key={i}/>
        );
        }

      }

      let directions = [];
      responseJson.text.map((stop) => {
        directions.push(<li class="list-group-item">{stop}</li>)
      });
     
      this.props.showDirections(directions);

      this.setState({
        // center: routeShape[0][0],
        zoom: 17,
        searchName: address,
        directionMarkers: stops,
        polyline: directionsPolylines,
      });
    }).catch(function(error) {
      console.log(error);
  });

}

  requestLocation(){
    //Function to find the current location of user from browser

    var self = this;

    var options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0
    };

    // upon success, do this
    function success(pos){
      // get longitude and latitude from the position object passed in
      var geolng = pos.coords.longitude;
      var geolat = pos.coords.latitude;
      var newCenter = {lat: geolat, lng: geolng}

      self.setState({
        // center: { ...self.state.center, lat: geolat, lon: geolng},
        center: newCenter,
        currentLocationLat: geolat,
        currentLocationLon: geolng,
        alreadyRequestedlocation: true,
        zoom: 17
      });

      // let moveCenter = {currentLocationLat:this.state.currentLocationLat, currentLocationLon: this.state.currentLocationLon}

    }

    // upon error, do this
    function error(err){
      // return the error message
      let msg = 'Error: ' + err + ' :(';
      self.setState({
        searchName: msg,
        alreadyRequestedlocation: true
      })
    }

    navigator.geolocation.getCurrentPosition(success, error, options); //above two functions (success and options variable are passed in as parameters here)
  }

  drawRoute(start, stop){
    //function to draw a route given two stop ids
    this.props.reset(); // sets draw route state of Main component back to false.
    let routeShape = [];
    fetch('/api/shapes/twostops/'+start+'/'+stop).then(function(response) { //API call.
      return response.json();
    }).then(data => {
      //CHANGE THIS make api "lng" not "lon" and this computation is undeeded
      data.shape.map((point) => {
        routeShape.push({lat: point.lat, lng: point.lon})
      });

      let busPolyline =
      <Polyline
      path={routeShape}
      strokeColor="#0000FF"
      strokeOpacity={0.8}
      strokeWeight={2} />;

      this.setState({
        center: routeShape[0],
        zoom: 17,
        searchName: 'Start',
        polyline: busPolyline
      });
    });
  }

  render() {
    //styles defined here
    let styles = {
      mapContainer: {
        height: '100%',
        width: this.props.display ? '50%' : '100%', //checks weather nav is open or closed and displays appropriatly.
        transition: 'left .3s ease-in-out',
        float: 'right',
        zIndex: '+1',
        paddingTop: '10px'
      },
      searchContainer: {
        textAlign: 'center'
      },
      reactMapContainer: {
        position: 'relative !important',
        height: '500px !important',
     },
      googleMap: { 
        height: '100%',
        width: this.props.display ? '50%' : '100%', //checks weather nav is open or closed and displays appropriatly.
        float: 'right',
        zIndex: '+1',
      },
      directions: {
        display: this.state.showDirections ? 'block' : 'none', //checks weather directions for a route is needed.
        position: 'absolute',
        backgroundColor: 'white',
        height: '100%',
        marginLeft: '85%',
        width: '15%',
        padding: '10px',
      },
      container: {
         display: 'inline-block',
         cursor: 'pointer',
         color: 'white',
         marginLeft: '20px',
         float: 'left',
         height: '100%'
     },
      form: {
        paddingTop: '15px',
        paddingBottom: '15px',
        textAlign: 'right',
        backgroundColor: 'rgb(3, 79, 152)',
        height: '60px'
      },
      topInput: {
        display: 'inline-block',
        width: '30%',
        marginRight: '2%',
        height: '3px',
        fontSize: '15px'
      },
      searchButton: {
        display: 'inline-block',
        float: 'right',
        marginRight: '20px',
        padding: '1px 5px'
       },
       divButton: {
        height: '0px',
        width:  '0px',
        display: 'none'
      },
      mapBox: {
        zIndex: '-1'
      },
      loading: {
        display: this.state.showLoading ? 'block' : 'none',
      }
    }
    //if map is not loaded do this
    if (!this.props.google) {
      return <div>Loading...</div>;
    }

    if (!this.state.alreadyRequestedlocation){
      //if the browser has not already requested the location do this.
      if('geolocation' in navigator){
        // geolocation is supported
        this.requestLocation();
      }else{
        // no geolocation
        let msg = "Sorry, looks like your browser doesn't support geolocation";
        this.setState({
          searchName: msg, //sets message to this
          alreadyRequestedlocation: true
        })
      }
    }

    //  **CHANGE THIS** - Need to optimise, do this in different file before import, uneeded computation here.
    // let allStops = [];
    // var i;
    // for (i in stops){
    //   allStops.push(stops[i]);
    // }

    //adds all the stops to marker array
    // let markers = [];
    // allStops.map(marker => {
    //   markers.push(
    //     <Marker
    //       position={{lat: marker.lat, lng: marker.lon}}
    //       title={marker.stop_name}
    //       name={marker.stop_name}
    //       onClick={this.onMarkerClick}
    //       icon={{
    //         url: "../static/images/bus_stop.png",
    //         anchor: new google.maps.Point(32,32),
    //         scaledSize: new google.maps.Size(10,10)
    //       }}
    //     />)
    //   });

      // Check weather to draw the route or not.
      if (this.props.route.drawRoute){
         this.handleJourneyPlannerSubmit(this.props.route.originName, this.props.route.startLat, this.props.route.startLng, this.props.route.destinationName, this.props.route.destLat, this.props.route.destLng, this.props.route.desLatLng);
      }
    
//     const button = React.createElement('div', {
  //               ref: 'xButton',
    //             onClick: e => this.props.onClick(e, this.refs.xButton),
      //           className: 'container'
        //    });

      return (
       <div style={styles.googleMap} >
                <div style={styles.form}>
                        <div ref='xButton' onClick={e => this.props.onClick(e, this.refs.xButton)} style={styles.container}>
                             <div style={styles.divButton}></div>
                             <div className="bar1"></div>
                             <div className="bar2"></div>
                             <div className="bar3"></div>
                          </div> 
                          <LocationSearchInput routeFinder={this.routeFinder} route={this.props.route} changeMapState={this.changeMapState} onMarkerClick={this.onMarkerClick}  onClick={this.props.onClick} showDirectionFromLocation={this.props.showDirectionFromLocation} xButton={this.refs.xButton} />
                  </div>
          <div id="mapBox" className="fullHeight" style={styles.mapBox} >
             <Map
              google={this.props.google}
              zoom={this.state.zoom}
              initialCenter={{
                lat: 53.3082648,
                lng: -6.22363949999999,
              }}
              center={this.state.center}
              onClick={this.onMapClicked}>
              
              {/* {markers} */}
              
              {/* Current location Marker */}
              <Marker
                position={{lat: this.state.currentLocationLat, lng: this.state.currentLocationLon}}
                title="Location"
                name="You are Here"
                onClick={this.onMarkerClick}
              /> 
              {this.state.startMarker}
              {this.state.directionMarkers}
              {this.state.endMarker}
              <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}>
                <div>
                  <h3>{this.state.selectedPlace.name}</h3>
                  <h4>{this.state.selectedPlace.time}</h4>
                </div>
              </InfoWindow>
              {this.state.polyline}
              </Map>
            </div>
          </div>
          );
        }
      }
      export default GoogleApiWrapper({
        apiKey: "AIzaSyC36Mq4sQqGL0ePgZRKN_FqCeY1olujJFM",
        v: "3.30"
      })(MapContainer);

