import React, { Component } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
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
      // searchName - used to display address of search to screen
      searchName: '',
      locationCoordinates: {}
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
          searchName : address //chages search name <p> value
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
    this.setState({
      center: { // change center of map
        lat: geolat,
        lon: geolng
      },
      locationCoordinates: { // change current location coordinates
        lat: geolat,
        lon: geolng
      }
    })
  }

  // upon error, do this
  function error(err){
    // return the error message
    msg = 'Error: ' + err + ' :(';
    this.setState({
      searchName: msg
    })
  }

    navigator.geolocation.getCurrentPosition(success, error, options); //above two functions (success and options variable are passed in as parameters here)
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

    if('geolocation' in navigator){
      // geolocation is supported
      this.requestLocation();
    }else{
      // no geolocation
      msg = "Sorry, looks like your browser doesn't support geolocation";
      this.setState({
        searchName: msg //sets message to this
      })
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
        />)
      });

    return (
      <div style={styles.mapContainer} >
        <button type="button" className="btn btn-outline-secondary" onClick={this.props.onClick} style={styles.button}></button> {/*button to hide/display nav side bar*/}
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
        {/*Google Map componet*/}
        <Map
          google={this.props.google}
          zoom={14}
          initialCenter={{
            lat: 53.350140,
            lng: -6.266155
          }}
          center={this.state.center}
          onClick={this.onMapClicked}>
          {/* {markers} */} {/* <-- Un-comment this to display all stops to map */}
          {/* Marker to display current location */}
          <Marker
            position={this.state.locationCoordinates}
            title="Location"
            name="You are Here"
            onClick={this.onMarkerClick}
          />
          {/* Marker to display location search result */}
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
        </Map>
      </div>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: "AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo",
  v: "3.30"
})(MapContainer);
