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
            this.setState({ address });
            console.log('Success', latLng);
           	var e = null;
    		//if (!this.props.route.sidebarOpen){
        	//	this.props.onClick(e, this.props.xButton);
    		// }
			let destinationMarker = <Marker
                id = "End Marker"
                position={latLng}
                title={this.state.address}
                name={this.state.address}
                onClick={this.onMarkerClick}
              />;
			this.props.changeMapState(latLng, this.state.address, destinationMarker, latLng.lat, latLng.lng);
			this.props.showDirectionFromLocation();
            let fromLocation=true;
      		this.props.routeFinder(address, fromLocation); 
        })
      .catch(error => console.error('Error', error));
  };

  render() {
    let styles = {
        topInput: {
            display: 'inline-block',
            width: '35%',
            marginRight: '2%',
            height: '30px',
            fontSize: '16px',
            zIndex: '+1',
            position: 'relative'
        },
        dropDown: {
            overflow: 'visible',
            zIndex: '+1',
            position: 'relative',
            width: '35%',
            marginLeft: '63%',
            fontSize: '15px',
            borderRadius: '25px'
        }
   } 

   const searchOptions = {
       location: new google.maps.LatLng(53.350140, -6.266155),
       radius: 2000,
       types: ['address']
    }

    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        searchOptions={searchOptions}
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
                  ? { backgroundColor: '#F0FFF0', cursor: 'pointer', fontSize: '15px' }
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
