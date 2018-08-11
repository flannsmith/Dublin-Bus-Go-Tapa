import React from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import {Marker} from "google-maps-react";

export default class TimetableAuto extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
        address: '',
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
            console.log('Success', latLng);
            //fetch here for 5 closest stops
            //chage options of dropdown.
            let options = []
            let lng = latLng.lng * -1;
    fetch('/api/stopfinder/'+latLng.lat+'/'+lng)
    .then((response) => response.json())
    .then((responseJson) => {
            console.log(responseJson);
            responseJson.stops.map((stop) => {
                let item = { value: stop.stop_id, label: stop.info.stop_name, className: 'list-group-item' };
                options.push(item);
            });
            this.props.changeCloseStops(options);
          });
        })
      .catch(error => console.error('Error', error));
  };

 componentWillReceiveProps(nextProps) {
     // You don't have to do this check first, but it can help prevent an unneeded render
     if (nextProps.isGoogleLoaded !== this.state.isGoogleLoaded) {
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
            width: '100%',
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
            width: '100%',
            fontSize: '15px',
            borderRadius: '25px'
        }
   }

if(this.state.mode){
    console.log("RETURNING AUTOCOMPLETE 1");
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
