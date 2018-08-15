import React from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import {Marker} from "google-maps-react";

export default class JourneySearchInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
        address: '', 
        options: null,
        mode: false,
        isGoogleLoaded: false
     };
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
            console.log(this.props.journeyPlannerFormStart);
            console.log(this.props.journeyPlannerFormEnd);
            this.props.journeyPlannerFormStart ? this.props.journeyPlannerFormStart(this.state.address, latLng.lat, latLng.lng) : null;
            this.props.journeyPlannerFormEnd ? this.props.journeyPlannerFormEnd(this.state.address, latLng.lat, latLng.lng, latLng) : null;
        })
      .catch(error => console.error('Error', error));
  };

  componentWillReceiveProps(nextProps) {
     // You don't have to do this check first, but it can help prevent an unneeded render
     if (nextProps.isGoogleLoaded !== this.state.isGoogleLoaded) {
       console.log("setting state too much");
       this.setState({ 
        mode: nextProps.isGoogleLoaded,
        isGoogleLoaded: true
        });
      }
   }

  render() {
    let styles = {
        topInput: {
            display: 'inline-block',
            marginRight: '2%',
            fontSize: '16px',
            zIndex: '+1',
            position: 'relative'
        },
        dropDown: {
            overflow: 'visible',
            zIndex: '+1',
            position: 'relative',
            fontSize: '15px',
            borderRadius: '25px'
        }
   }

    const onError = (status, clearSuggestions) => {
     console.log('Google Maps API returned error with status: ', status)
     clearSuggestions()
    }
 
if(this.state.mode){
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
        onError={onError}
        searchOptions={searchOptions}
        googleCallbackName="initTwo"
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
   } else {
        return (
            <div>
                <h4>Loading</h4>
            </div>
         );
    }
  }
}

