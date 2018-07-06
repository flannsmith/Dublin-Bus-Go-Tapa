    import React, { Component } from "react";
    import { Map, InfoWindow, Marker, GoogleApiWrapper, Polyline } from "google-maps-react";
    import {geolocated} from 'react-geolocated';
    import stops from './stops.js';

    export class MapContainer extends Component {
      constructor(props) {
        super(props);
        //Define all the  functions that are to be bound to this component
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMapClicked = this.onMapClicked.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.setSearchInputElementReference = this.setSearchInputElementReference.bind(this);
        this.geocodeAddress = this.geocodeAddress.bind(this);
        this.requestLocation = this.requestLocation.bind(this);
        this.drawRoute = this.drawRoute.bind(this);

        //Set the state of the component
        this.state = {
          showingInfoWindow: false,
          activeMarker: {},
          selectedPlace: {},
          //Center - used to change the location of the map when a location is eneterd in search bar.
          center: {
            lat: 53.350140,
            lon: -6.266155
          },
          zoom: 15,
          // searchName - used to display address of search to screen
          searchName: '',
          currentLocationLat: 53.350140,
          currentLocationLon: -6.266155,
          alreadyRequestedlocation: false,
          routeCoords: []
        };
      }

      componentDidMount(){
        //Function that runs when componet "mounts" or binds to the actual DOM.
         this.geocoder = new google.maps.Geocoder();
      }


      onMarkerClick(props, marker, e) {
        //Function to control marker click event
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

      handleFormSubmit(submitEvent){
        //Function to gather form data and send to geocodeAddress funciton
        submitEvent.preventDefault(); //prevents http request (page reloading) normal form behaviour
        var address = this.searchInputElement.value; //gets form input value
        this.geocodeAddress(address);
      }

      setSearchInputElementReference(inputReference){
        //function whos parameter is linked to the ref of the form input (ie. gets form input value and stores it.)
        this.searchInputElement = inputReference;
      }


      geocodeAddress(address) {
        //function to find co-ordinates from given address
        this.geocoder.geocode({ 'address': address }, function handleResults(results, status) {

          //if result is found do this
          if (status === google.maps.GeocoderStatus.OK) {
            let address = ''; //store address here
            results[0].address_components.map(names => { //loops through the array of addres components and adds to full address.
              address += names.short_name + ", "
            })
            this.setState({
              center : results[0].geometry.location, //chages center of map and center marker
              searchName : address, //chages search name <p> value
              zoom: 16
              }
            );

            return; //used to exit function
          }

          //if no result is found do this
          this.setState({
            lat: 53.350140,
            lng: -6.266155
          });

        }.bind(this));
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
        console.log(geolng, geolat);
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
      //Below address needs to match port and host change from a static path to relative path
      console.log(start, stop);
      this.props.reset();
      let routeShape = [];
      fetch('http://127.0.0.1:8000/api/shapes/twostops/'+start+'/'+stop).then(function(response) {
          return response.json();
        }).then(data => {
          //CHANGE THIS make api "lng" not "lon" and this computation is undeeded
          data.shape.map((point) => {
            routeShape.push({lat: point.lat, lng: point.lon})
          })
          this.setState({
            routeCoords: routeShape,
            center: routeShape[0],
            zoom: 17,
            searchName: 'Start'
          });
      });
    }

      render() {
        //styles defined here
        let styles = {
          mapContainer: {
            height: '100%',
            width: this.props.display ? '75%' : '100%',
            transition: 'left .3s ease-in-out',
            float: 'right'
          },
          button: {
            backgroundColor: 'Black'
          }
        }
        //if map is not loaded do this
        if (!this.props.google) {
          return <div>Loading...</div>;
        }

        if (!this.state.alreadyRequestedlocation){
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
        let allStops = [];
        var i;
        for (i in stops){
          allStops.push(stops[i]);
        }

        //adds all the stops to marker array
        let markers = [];
        allStops.map(marker => {
            markers.push(
              <Marker
              position={{lat: marker.lat, lng: marker.lon}}
              title={marker.stop_name}
              name={marker.stop_name}
              onClick={this.onMarkerClick}
              icon={{
                url: "../static/images/bus_stop.png",
                anchor: new google.maps.Point(32,32),
                scaledSize: new google.maps.Size(10,10)
              }}
            />)
          });

        // Check weather to draw the route or not.
        if (this.props.route.drawRoute){
          this.drawRoute(this.props.route.start, this.props.route.stop);
        }

        return (
          <div style={styles.mapContainer} >
            <button type="button" className="btn btn-outline-secondary" onClick={this.props.onClick} style={styles.button}></button>
            <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <form className="form-inline" onSubmit={this.handleFormSubmit}>
                  <div className="row">
                    <div className="col-xs-8 col-sm-10">
                      <div className="form-group">
                        <label className="sr-only" htmlFor="address">Address</label>
                        <input type="text"
                          className="form-control input-lg"
                          id="address"
                          placeholder="Rathmines"
                          ref={this.setSearchInputElementReference}
                          required />
                      </div>
                    </div>
                    <div className="col-xs-4 col-sm-2">
                      <button type="submit" className="btn btn-default btn-lg">
                        <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
          </div>
          <div className="row">
            <div className="col-sm-12">

              <p className="bg-info">{this.state.searchName}</p>

            </div>
          </div>
        </div>

            <Map
              google={this.props.google}
              zoom={this.state.zoom}
              initialCenter={{
                lat: 53.350140,
                lng: -6.266155
              }}
              center={this.state.center}
              onClick={this.onMapClicked}>
                {/* {markers} */}
                <Marker
                  position={{lat: this.state.currentLocationLat, lng: this.state.currentLocationLon}}
                  title="Location"
                  name="You are Here"
                  onClick={this.onMarkerClick}
                />
                <Marker
                  position={this.state.center}
                  title={this.state.searchName}
                  name={this.state.searchName}
                  onClick={this.onMarkerClick}
                />
                <InfoWindow
                  marker={this.state.activeMarker}
                  visible={this.state.showingInfoWindow}>
                    <div>
                      <h1>{this.state.selectedPlace.name}</h1>
                    </div>
                </InfoWindow>
                <Polyline
                path={this.state.routeCoords}
                strokeColor="#0000FF"
                strokeOpacity={0.8}
                strokeWeight={4} />
            </Map>
          </div>
        );
      }
    }
    export default GoogleApiWrapper({
      apiKey: "AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo",
      v: "3.30"
    })(MapContainer);

