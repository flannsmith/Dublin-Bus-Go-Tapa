import React from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import {Marker} from "google-maps-react";

export default class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: '' };
  }

  handleChange = address => {
    this.setState({ address });
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
            console.log('Success', latLng);
           	var e = null;
    		if (!this.props.route.sidebarOpen){
        		this.props.onClick(e, this.props.xButton);
    		 }
    		this.props.showDirectionFromLocation();
			let destinationMarker = <Marker
                id = "End Marker"
                position={latLng}
                title={this.state.address}
                name={this.state.address}
                onClick={this.onMarkerClick}
              />;
			this.props.changeMapState(latLng, this.state.address, destinationMarker, latLng.lat, latLng.lng);
			let fromLocation=true;
      		this.props.routeFinder(address, fromLocation); 
        })
      .catch(error => console.error('Error', error));
  };

  render() {
    let styles = {
        topInput: {
            display: 'inline-block',
            width: '30%',
            marginRight: '2%',
            height: '3px',
            fontSize: '16px',
            zIndex: '+1',
            position: 'relative'
        },
        dropDown: {
            overflow: 'visible',
            zIndex: '+1',
            position: 'relative',
            width: '30%',
            marginLeft: '68%',
            fontSize: '15px',
            borderRadius: '25px'
        }
   } 

    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        googleCallbackName="initOne"
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input form-control',
                style: styles.topInput 
             })}
            />
            <div className="autocomplete-dropdown-container list-group" style={styles.dropDown}>
              {loading && <div className="list-group-item">Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active list-group-item'
                  : 'suggestion-item list-group-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer', fontSize: '15px' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer', fontSize: '15px' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}
