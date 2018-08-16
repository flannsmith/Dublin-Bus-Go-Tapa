import Dropdown from 'react-dropdown';
import React from "react";
import TimetableAuto from "./timetablesAutocomplete.jsx";
import { Marker, Polyline } from "google-maps-react";

export default class Timetables extends React.Component {
 constructor(props) {
    super(props);

	//bind your methonds here following this example below
	// this.exampleMethod = this.exampleMethod.bind(this);
    this._onSelect1 = this._onSelect1.bind(this);
    this._onSelect2 = this._onSelect2.bind(this);    
    this._onSelect3 = this._onSelect3.bind(this);
    this.fillVariations = this.fillVariations.bind(this);
    this.fillStartStops = this.fillStartStops.bind(this);
    this.getTimetables = this.getTimetables.bind(this);    
    this.changeCloseStops = this.changeCloseStops.bind(this);

    this.state = {
        routePlace: "Select a route:",
        variationPlace: "Select a direction: ",
        stopPlace: "Select a stop: ",
        allRoutes: null,
        route: null,
        variations: null,
        variation: null,
        selectedVariation: null,
        startStops: null,
        rawStartStops: null,
        selectedStartStop: null,
        startStopName: null,
        timeTable: null,
        closeStops: null
    };
}

changeCloseStops(options){
    console.log(options);
    this.setState({
      closeStops: options
    });
}

componentDidMount() {
    console.log("fetch stops")
    let options = [];
    let lat = this.props.currentLocationLat
    let lng = this.props.currentLocationLon * -1
    fetch('/api/stopfinder/'+lat+'/'+lng)
    .then((response) => response.json())
    .then((responseJson) => {
       console.log(responseJson);
       responseJson.stops.map((stop) => { 
          let item = { value: stop.stop_id, label: stop.info.stop_name, className: 'list-group-item' };
          options.push(item);
        });
       this.setState({
          closeStops: options
        });
    });

}


_onSelect1(option) {
  this.setState({route: option.value, routePlace: option.value}, this.fillVariations(option));
}

fillVariations(option){
  console.log("Entered fillVariations");
  console.log(option);
  let variation = String(option.value);
  let options = []; 
         
  fetch('/api/routeselection/routevariations/'+variation)
    .then((response) => response.json()) 
    .then((responseJson) => {
          console.log(responseJson);
          let i = 0;
          responseJson.data[variation].map((variation) => {
            console.log(variation);
            let item = { value: i, label: variation, className: 'list-group-item'};
            i++;
            options.push(item);
          });
        this.setState({
            variations: options 
         });
    });
}

_onSelect2(option) {
  this.setState({
    variation: option,
    selectedVariation: option.value,
    variationPlace: option.value
    },
   this.fillStartStops(option));
}

fillStartStops(option){
  let route = String(this.state.route);
  console.log("Entered startStops");
  console.log(option);
  let stop = option.value;
  let options = [];

 fetch('/api/routeselection/routestops/'+route+'/'+stop)
    .then((response) => response.json())
    .then((responseJson) => {
          console.log(responseJson);
          responseJson.map((variation) => {
            console.log(variation);
            let item = { value: variation.id, label: variation.name, className: 'list-group-item' };
            options.push(item);
          });
        this.setState({
            startStops: options,
            rawStartStops: responseJson
         });
    });
}

_onSelect3(option) {
  this.setState({
    selectedStartStop: option.value,
    startStopName: option.label,
    stopPlace: option.value
    },
  this.getTimetables(option));
}

getTimetables(option){
  let stopNumber = String(option.value);
  let markers = [];
  let polylines = [];
  let stopLat = null;
  let stopLng = null;
  fetch('/api/routeselection/route_shapes_for_stop/'+stopNumber)
    .then((response) => response.json())
    .then((responseJson) => {
        if(responseJson.error){
            console.log("Error in route_shapes_for_stop api");
        }else{
        console.log(responseJson);
        stopLat = responseJson.begin_stop.lat;
        stopLng = responseJson.begin_stop.lon;
        let originMarker = <Marker
                position={{lat: stopLat, lng: stopLng}}
                title="Stop"
                name="Stop"
                onClick={this.props.mapRef.onMarkerClick}
              />;        
        markers.push(originMarker);

        responseJson.data.map((route) => {

        /*let startLat = route.stops[0].lat;
        let startLng = route.stops[0].lon;
        let destLat = route.stops[1].lat;
        let destLng = route.stops[1].lon;

        let originMarker = <Marker
                position={{lat: startLat, lng: startLng}}
                title="Route"
                name="Route"
                onClick={this.props.mapRef.onMarkerClick}
              />;

        let endMarker = <Marker
                position={{lat: destLat, lng: destLng}}
                title="Route"
                name="Route"
                onClick={this.props.mapRef.onMarkerClick}
              />;
        
        markers.push(originMarker);
        markers.push(endMarker);
        */

        let busPolyline = 
                <Polyline
                path={route.shape}
                strokeColor={route.colors}
                strokeOpacity={0.8}
                strokeWeight={2} />;
        
        polylines.push(busPolyline);
       });
      }
    console.log(polylines, markers);
    console.log(stopLat, stopLng);
    this.props.setMapTimetable(null, null, markers, polylines, stopLat, stopLng);
    });
  //console.log(polylines, markers);
  //console.log(stopLat, stopLng);
  //this.props.setMapTimetable(null, null, markers, polylines, stopLat, stopLng);

  let timetables = null;
    fetch('/api/timetables/'+stopNumber)
    .then((response) => response.json())
    .then((responseJson) => {
    console.log(responseJson);
    if (responseJson.error){
        alert("No more buses scheduled for this stop today. Please try again tomorrow.");
    }else{
            let timetables = [];
            timetables.push(<thead><tr><th scope="col">Timetable for stop {stopNumber}</th></tr><tr><th scope="col">Arrives:</th><th scope="col">Route:</th></tr></thead>);
            let rows = [];
            responseJson.timetable.map((stopTimetable)=>{
                    rows.push(<tr><td>{stopTimetable.arrive}</td><td>{stopTimetable.route}</td></tr>)
                });
            timetables.push(<tbody>{rows}</tbody>);
            this.props.setTimeTables(timetables);
        }
      }
    );
}

render() { 
    //styles defined here
    let styles = {
        timeTableText:{
            color: 'white'
        }
    }

    const defaultOption = null;

	return (
       <div>
         <div className="form-group">
             <h4 style={styles.timeTableText}>Find stops near:</h4>
             <TimetableAuto isGoogleLoaded={this.props.isGoogleLoaded} changeCloseStops={this.changeCloseStops} />
         </div>
        {/*
         <div className="form-group">
            <Dropdown
                   className='quickTimesDropdown'
                   menuClassName='list-group makeScroll'
                   options={this.state.variations}
                   onChange={this._onSelect2}
                   value={defaultOption}
                   placeholder={this.state.variationPlace}
            />
         </div>
        */}
         <div className="form-group">
                <h4 style={styles.timeTableText}>Stop Timetables:</h4>
                <Dropdown
                   className='quickTimesDropdown'
                   menuClassName='list-group makeScroll'
                   options={this.state.closeStops}
                   onChange={this._onSelect3}
                   value={defaultOption}
                   placeholder={this.state.stopPlace}
                />
          </div>
        </div>
		);
	}
}
