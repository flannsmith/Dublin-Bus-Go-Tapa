import React, { Component } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.onMarkerClick = this.onMarkerClick.bind(this);
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
  render() {
    const styles = {
      mapContainer : {
        width: '100%',
        height: '100%'
      }
    }

    if (!this.props.google) {
      return <div>Loading...</div>;
    }

    return (
      <div style={styles.mapContainer} >
        <Map
          google={this.props.google}
          zoom={13}
          initialCenter={{
            lat: 53.350140,
            lng: -6.266155
          }}>
          
            <Marker
              onClick={this.onMarkerClick}
              icon={{
                url: "/img/icon.svg",
                anchor: new google.maps.Point(32, 32),
                scaledSize: new google.maps.Size(64, 64)
              }}
              name={"Current location"}
            />
            <InfoWindow
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}
            >
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

