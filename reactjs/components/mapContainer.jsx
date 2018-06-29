import React, { Component } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
// import * as stops from '../static/js/stops;

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onMapClicked = this.onMapClicked.bind(this);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {}
    };
  }

  onMarkerClick(props, marker, e) {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  onMapClicked(mapProps, map, clickEvent) {
    console.log("MapClicked")
  }

  render() {

    let styles = {
      mapContainer: {
        height: '100%',
        width: this.props.display ? '75%' : '100%',
        transition: 'left .3s ease-in-out',
        float: 'right'
      }
    }

    if (!this.props.google) {
      return <div>Loading...</div>;
    }

    return (
      <div style={styles.mapContainer} >
        <button onClick={this.props.onClick}></button>
        <Map
          google={this.props.google}
          zoom={14}
          initialCenter={{
            lat: 53.350140,
            lng: -6.266155
          }}
          onClick={this.onMapClicked}>

        <Marker
          onClick={this.onMarkerClick}
          title={'Stop 8220B007612'}
          name={'Davenport Hotel Merrion Street'}
          position={{lat: 53.3413467794909, lng: -6.250529480367451}} />

        <InfoWindow onClose={this.onInfoWindowClose}>
            <div>
              <h1></h1>
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
