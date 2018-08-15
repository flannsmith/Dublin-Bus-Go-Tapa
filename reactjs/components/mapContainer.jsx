import React, { Component } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper, Polyline } from "google-maps-react";
import LocationSearchInput from "./LocationSearchInput.jsx";
import Clock from "./clock.jsx";
import ReactLoading from "react-loading";
import Toggle from 'react-bootstrap-toggle';

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
    this.tick = this.tick.bind(this);
    this.sendLocation = this.sendLocation.bind(this);
    this.resetStartTimer = this.resetStartTimer.bind(this);    
    this.toggleMap = this.toggleMap.bind(this);

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
      timer: false,
      stopTimer: false,
      time: 1,
      notLoadedYet: true,
      directions: false,
      timetables: false,
      user: false,
      toggleActive: false
    };
  }

  componentDidMount(){
    //Function that runs when componet "mounts" or binds to the actual DOM.
    this.geocoder = new google.maps.Geocoder();
    this.props.setMapRef(this);
    if('geolocation' in navigator){
        // geolocation is supported
        this.requestLocation();
      }else{
        // no geolocation
        let msg = "Sorry, looks like your browser doesn't support geolocation";
        console.log("Sorry, looks like your browser doesn't support geolocation");
        this.setState({
          searchName: msg, //sets message to this
          alreadyRequestedlocation: true
        })
      }
  }

  toggleMap(){
    if(this.props.route.showDirections){
        this.props.toggleDirections();
        this.setState({
            directions: true,
            timetables: false,
            user: false
        });      
     }

    else if(this.props.route.displayTimetables){
         this.props.toggleTimetable();
         this.setState({
            timetables: true,
            directions: false,
            user: false,
        });
    }

    else if(this.props.route.displayUser){
        this.props.toggleUser();
        this.setState({
            user: true,
            timetables: false,
            directions: false,
        });
    }

    else if(this.state.directions){
        this.props.toggleDirections();        
    }
    
    else if(this.state.timetables){
        this.props.toggleTimetable();
    }

    else if(this.state.user){
        this.props.toggleUser();
    }


    this.setState({ toggleActive: !this.state.toggleActive });
  }

  tick(){
    let newTime = this.state.time + 1;
    this.setState({
      time: newTime
    });
  }

  onMarkerClick(props, marker, e) {
    //Function to control marker click event, sets active marker to the current clicked marker
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }
  
  resetStartTimer(value){
  this.setState({
      timer: value
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
    console.log(results, address, destinationMarker, lat, lng);  
    this.props.setStartEndMarker(null, destinationMarker);
    this.setState({
          center : results, //chages center of map and center marker
          searchName : address, //chages search name <p> value
          zoom: 13,
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

    console.log(originName, startLat, startLng, destinationName, destLat, destLng, destLatLng);
    this.props.setStartEndMarker(originMarker, destinationMarker);
    this.setState({
        zoom: 13, 
        startLat: startLat,
        startLon: startLng,
        center : destLatLng, //chages center of map and center marker
        searchName : destinationName, //chages search name <p> value
        destinationLat: destLat,
        destinationLng: destLng
       },
        () => {
            let fromLocation=false;
            this.routeFinder(destinationName, fromLocation);
        }
    );
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
  
  let timeInSeconds = 0;
  let dayOfWeek = null;
  //Block below is to get the current time of day in seconds from users device to be used in API call.
  if (fromLocation == true){
     let now = new Date();
     let midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,0,0);
    const timeInMilliseconds = now.getTime() - midnight.getTime();
    timeInSeconds = timeInMilliseconds / 1000; // Slow can optimize this ^^, too many uneeded steps.
    dayOfWeek = now.getDay();
    dayOfWeek = dayOfWeek.toFixed(2);
  } else {
     let now = this.props.route.date;
     let midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,0,0);
    const timeInMilliseconds = now.getTime() - midnight.getTime();
    timeInSeconds = timeInMilliseconds / 1000; // Slow can optimize this ^^, too many uneeded steps.
    timeInSeconds = timeInSeconds.toFixed(2);
    dayOfWeek = now.getDay();
    dayOfWeek = dayOfWeek.toFixed(2);
  }

  //let routeShape = {}; //holds all the direction objects
  let stops = []; //holds all markers for a route
  console.log("fetch('/api/routefinder/"+originLat+"/"+originLng+"/"+destLat+"/"+destLng+"/"+dayOfWeek+'/'+timeInSeconds+")");
  fetch('/api/routefinder/'+originLat+'/'+originLng+'/'+destLat+'/'+destLng+'/'+dayOfWeek+'/'+timeInSeconds) //API call
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("response json is here:", responseJson);
     if(responseJson.data){
/*  Below block of code now redudant as backend code provides walking and bus objects already broken up, left here as backup if new api fails.

      //In the below block of code we loop through all the data and store each bus route and walking route (which contain location objects) in its own array which in turn are all stored in the routeShape object. From this then we have a route shape object that has all the sub journeys of a route (arrays) as properties.
      let isPreviousRouteWalking = false; 
      let arrayID = "";
      let notFirstStop = false;
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
*/
        responseJson.data.map((stop) => { //Loops through the json marker data
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
    
     let directionsPolylines = [];
     responseJson.shapes.bus.map((stop) => {
        directionsPolylines.push(
          <Polyline
          path={stop}
          strokeColor="#0000FF"
          strokeOpacity={0.8}
          strokeWeight={2}
          />
        );
     });
   
     /*let lineSymbol = {
          path: 'M 0,-1 0,1',
          strokeOpacity: 1,
          scale: 4
        };*/ 
     responseJson.shapes.walk.map((stop) => {
        directionsPolylines.push(
          <Polyline
          path={stop}
          strokeColor="#ff0707"
          strokeOpacity={0.5}
          strokeWeight={1.5}
          />
        );
     });
      
      console.log(stops);
      console.log(responseJson.data);
      console.log(responseJson.data[responseJson.data.length -1]);
      let lastMarker = responseJson.data[responseJson.data.length -1];
      console.log(lastMarker);
      let stopTime = new Date(lastMarker.time * 1000).toISOString().substr(11, 8);
      this.props.setTime(stopTime);
 
  /*    for (var index in routeShape){
        if (routeShape[index][0].color == "walking"){
          directionsPolylines.push(
          <Polyline
          path={routeShape[index].slice(1,)}
          strokeColor="#ff0707"
          strokeOpacity={0.8}
          strokeWeight={2}
          key={index}/>
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

      } */

      let directions = [];
      responseJson.text.map((stop) => {
        directions.push(<li className="list-group-item">{stop}</li>)
      });
     
      this.props.showDirections(directions);
      this.props.setDirectionMpolyline(stops, directionsPolylines);
      this.setState({
        // center: routeShape[0][0],
        zoom: 13,
        searchName: address,
      });
    }else{
        this.props.toggleLoading();
        alert("Sorry there are no scheduled buses for the chosen time. Please select a earlier date/time.");
        console.log(responseJson.error-type);
    }
    }).catch(function(error) {
      console.log(error);
  });

}

  requestLocation(){
    //Function to find the current location of user from browser
    console.log("requestingLocation");
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

      self.props.setCurrentLocation(geolat, geolng);      

      self.setState({
        // center: { ...self.state.center, lat: geolat, lon: geolng},
        currentLocationLat: geolat,
        currentLocationLon: geolng,
        zoom: 17,
      }, () => { 
           if(!self.state.alreadyRequestedlocation){
            self.setState({
            timer: true,
            alreadyRequestedlocation: true,
            center: newCenter
        });
       }
    }
);

      // let moveCenter = {currentLocationLat:this.state.currentLocationLat, currentLocationLon: this.state.currentLocationLon}

    }

    // upon error, do this
    function error(err){
      // return the error message
      let msg = 'Error: ' + err + ' :(';
      console.log(msg);
      self.setState({
        searchName: msg,
        alreadyRequestedlocation: true
      })
    }

    navigator.geolocation.watchPosition(success, error, options); //above two functions (success and options variable are passed in as parameters here)
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
        zoom: 13,
        searchName: 'Start',
        polyline: busPolyline
      });
    });
  }

  sendLocation(){
    console.log("About to send fetch to db.");
    let originLng = 0;
    if (this.state.currentLocationLon < 0){
        originLng = this.state.currentLocationLon * -1;
    }
    fetch('/api/userLocation/'+this.state.currentLocationLat+'/'+originLng, {method: "GET", credentials: 'same-origin'}); //API call.
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
        display: this.props.route.showDirections ? 'block' : 'none', //checks weather directions for a route is needed.
        marginTop: '50px'
        //  position: 'absolute',
        //backgroundColor: 'white',
       // height: '100%',
       // marginLeft: '85%',
       // width: '15%',
       // padding: '10px',
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
        // Original blue: backgroundColor: 'rgb(3, 79, 152)',
        backgroundColor: 'rgb(255, 204, 1)',
        height: '60px',
        boxShadow: '1px 1px 5px 1px #888888',
        marginBottom: '8px'
      },
      buttonDiv: {
        marginBottom: '-37px',
        zIndex: '+1'
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
        zIndex: '-1',
        display: this.props.route.loading ? 'none' : this.props.route.showDirections ? 'none' : this.props.route.displayTimetables ? 'none' : this.props.route.displayUser ? 'none' : 'block',
      },
      mapToggleButton: {
        zIndex: '+1',
        marginLeft: '15px'
     },
      loading: {
        display: this.props.route.loading ? 'block' : 'none',
      },
      timetable: {
        display: this.props.route.displayTimetables ? 'block' : 'none',
      },
      user: {
        display: this.props.route.displayUser ? 'block' : 'none',
        marginTop : "3%",
        marginLeft : "5%",
        //table, td, th{
         //   border: 1px,
       // }
    },
      table: {
        marginTop: '50px'
      },
      eta: {
        border: '0px'
    }
    }

    let mapContainer_class = this.props.display ? "mapContainerOpen" : "mapContainerClosed";
    let googleMap_class = this.props.display ? "googleMapOpen" : "googleMapClosed";
    

    //if map is not loaded do this
    if (!this.props.google) {
      return <div>Loading...</div>;
    }

    if(this.props.route.center){
         this.setState({
          center: this.props.route.center
        });
        this.props.resetCenter();        
    }
    
    if (this.props.google && this.state.notLoadedYet) {
      console.log("Google is Loaded");
      this.setState({
          notLoadedYet: false
        });
      this.props.isGoogleLoaded(true);
    }

   /* if (!this.state.alreadyRequestedlocation){
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
    }*/

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
         this.handleJourneyPlannerSubmit(this.props.route.originName, this.props.route.startLat, this.props.route.startLng, this.props.route.destinationName, this.props.route.destLat, this.props.route.destLng, this.props.route.destLatLng);
      }

    
      if (this.state.time % 60 == 0){
        console.log(this.state.time);
        this.sendLocation();  
      }
    
//     const button = React.createElement('div', {
  //               ref: 'xButton',
    //             onClick: e => this.props.onClick(e, this.refs.xButton),
      //           className: 'container'
        //    });

      return (
       <div className={googleMap_class} >
                <div style={styles.form}>
                        <div ref='xButton' onClick={e => this.props.onClick(e, this.refs.xButton)} style={styles.container}>
                             <div style={styles.divButton}></div>
                             <div className="bar1"></div>
                             <div className="bar2"></div>
                             <div className="bar3"></div>
                          </div> 
                          <LocationSearchInput routeFinder={this.routeFinder} route={this.props.route} changeMapState={this.changeMapState} onMarkerClick={this.onMarkerClick}  onClick={this.props.onClick} showDirectionFromLocation={this.props.showDirectionFromLocation} xButton={this.refs.xButton} />
        </div>

        <div style={styles.buttonDiv}>
            <Toggle
                onClick={this.toggleMap}
                on={<h2>Map</h2>}
                off={<h2>Details</h2>}
                height="30px"
                width="55px"
                size="xs"
                style={styles.mapToggleButton}
                offstyle="danger"
                active={this.state.toggleActive}
                disabled={this.props.route.mapToggleDisabeled}
            />
         </div>

         <div style={styles.loading}>
           <ReactLoading type={"bubbles"} color="rgb(3, 79, 152)" height={'100%'} width={'100%'}/>
         </div>

         <div style={styles.directions}>
            <li className="list-group-item" style={styles.eta}>
            <p className="lead">ETA:</p>
            <p className="lead">{this.props.route.eta}</p>
           </li>
            {this.props.route.userDirections}
          </div>
          
            <div className="tableStyle" style={styles.user}>
                {this.props.route.userDetails}
            </div>

          <div style={styles.timetable}>
            <table className="table" style={styles.table}>
            {this.props.route.timetables}
            </table>
         </div>

          <div id="mapBox" className="fullHeight" style={styles.mapBox} >
            <Clock stopTimer={this.state.stopTimer} tick={this.tick} timer={this.state.timer} resetStartTimer={this.resetStartTimer} /> 
            <Map
              google={this.props.google}
              zoom={this.state.zoom}
              initialCenter={{
                lat: 53.3082648,
                lng: -6.22363949999999,
              }}
              center={this.state.center}
              onClick={this.onMapClicked}>
              
              {/* Current location Marker */}
              <Marker
                position={{lat: this.state.currentLocationLat, lng: this.state.currentLocationLon}}
                title="Location"
                name="You are Here"
                onClick={this.onMarkerClick}
              /> 
              {this.props.route.startMarker}
              {this.props.route.directionMarkers}
              {this.props.route.endMarker}
              <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}>
                <div>
                  <h3>{this.state.selectedPlace.name}</h3>
                  <h4>{this.state.selectedPlace.time}</h4>
                </div>
              </InfoWindow>
              {this.props.route.polyline}
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

