import React from "react";
import Calendar from "../components/calendar";
import ReactLoading from "react-loading";
import Dropdown from 'react-dropdown';
import { Marker, Polyline } from "google-maps-react";

export default class QuickTimes extends React.Component {
   constructor(props) {
    super(props);
    //Define all the  functions that are to be bound to this component. This is needed as when bable compiles all jsx files into one big bundle the browser will not be able define what "this" is related to. Doing these bindings configures it so the browser knows they are related to this compoent (class).
    this._onSelect1 = this._onSelect1.bind(this);
    this._onSelect2 = this._onSelect2.bind(this);
    this._onSelect3 = this._onSelect3.bind(this);
    this._onSelect4 = this._onSelect4.bind(this);
    this.fillVariations = this.fillVariations.bind(this);
    this.fillStartStops = this.fillStartStops.bind(this);
    this.fillEndStops = this.fillEndStops.bind(this);
    this.getShapes = this.getShapes.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.submit = this.submit.bind(this);

    //Set the state of the component, a dictionary of data we want to use/manipulate.
   this.state = {
     routes: null,
     variations: null,
     startStops: null,
     endStops: null,
     variation: null,
     rawStartStops: null,
     selected: "Select a route",
     selectedVariation: "Pick a direction:",
     selectedStartStop: "Start stop:",
     selectedDestiantion: "Destination stop:",
     startStopName: null,
     endStopName: null,
     date: null,
     eta: null,
     loading: false,
     showDirections: false,
     variationOpen: false,
     startStopOpen: false,
     destinationStopOpen: false,
     calenderOpen: false,
     submitOpen: false,
     departureTime: null
   }
}


submit(event){

    this.setState({
       loading: true
     });

    event.preventDefault();        
    let now = this.state.date;
    let midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,0,0);
    const timeInMilliseconds = now.getTime() - midnight.getTime();
    let timeInSeconds = timeInMilliseconds / 1000;
    console.log(timeInSeconds);
    
    let route = String(this.state.selected);
    console.log(this.state.selected);
    let variation = this.state.variation.value;
    let start = this.state.selectedStartStop;
    let end = this.state.selectedDestiantion;   
    console.log("fetch('/api/predictor/'"+now.getDay()+"'/'"+route+"'/'"+variation+"'/'"+start+"'/'"+end+"'/'"+timeInSeconds+")");
    fetch('/api/predictor/'+now.getDay()+'/'+route+'/'+variation+'/'+start+'/'+end+'/'+timeInSeconds) //API call
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        if(responseJson["arrival time"]){
            let departureTime = responseJson["departure time"];
            let arrivalTime = responseJson["arrival time"];
            departureTime = departureTime.slice(0, 4);
            arrivalTime = arrivalTime.slice(0, 4);
            console.log(arrivalTime);
            this.setState({
                loading: false,
                eta: arrivalTime,
                showDirections: true,
                departureTime: departureTime,
             });
        }else{
            this.setState({
                loading: false,
             });
            alert("Sorry there are no scheduled buses for the chosen time. Please select a different date/time.");
            console.log(responseJson.error-type);
        }
    });
}


handleDate(date){
   this.setState({
    date: date._d,
    submitOpen: true
   }, () => console.log(date, date._d.getTime()));
};

_onSelect1(option) {
    console.log("in onselect1")
    console.log(option)
  this.setState({
    selected: option.value, 
    variationOpen: true, 
    startStopOpen: false, 
    destinationStopOpen: false,
    calenderOpen: false,
    submitOpen: false
  }, this.fillVariations(option));
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
    startStopOpen: true,
    destinationStopOpen: false,
    calenderOpen: false,
    submitOpen: false
    }, 
   this.fillStartStops(option));
}

fillStartStops(option){
  let route = String(this.state.selected);
  console.log("Entered startStops");
  console.log(option);
  let stop = option.value;
  let options = [];
  console.log(route);
console.log(stop);
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
    destinationStopOpen: true,
    calenderOpen: false,
    submitOpen: false
    },
  this.fillEndStops(option));
}

fillEndStops(option){
  
  console.log(this.state.rawStartStops);
  console.log(option.value);
  let stopNumber = String(option.value);
  let index_of_start_stop = this.state.rawStartStops.findIndex((i) => i.id === stopNumber) + 1;
  console.log(index_of_start_stop);
  let endStops = this.state.rawStartStops.slice(index_of_start_stop);
  console.log(endStops);
  let options = [];
  endStops.map((stop) => {
       console.log(stop);
       let item = { value: stop.id, label: stop.name, className: 'list-group-item' };
       options.push(item);
   });
   this.setState({
     endStops: options
  });
}

_onSelect4(option) {
  this.setState({
    selectedDestiantion: option.value,
    endStopName: option.label,
    calenderOpen: true,
    submitOpen: false
    },
   this.getShapes(option));
}

getShapes(option){
  let route = String(this.state.selected);
  let variation = this.state.variation.value;
  let start = this.state.selectedStartStop;
  let end = option.value;
  let routeShape = [];
  let polyline = [];
  let startM = null;
  let endM = null;
  
 fetch('/api/routeselection/route_shape/'+route+'/'+variation+'/'+start+'/'+end)
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        let startLat = responseJson.stops[0].lat;
        let startLng = responseJson.stops[0].lon;
        let destLat = responseJson.stops[1].lat;
        let destLng = responseJson.stops[1].lon; 

        let originMarker = <Marker
                id="Origin Marker"
                position={{lat: startLat, lng: startLng}}
                title={this.state.startStopName}
                name={this.state.startStopName}
                onClick={this.props.mapRef.onMarkerClick}
              />;
        
        let endMarker = <Marker
                id="Destination Marker"
                position={{lat: destLat, lng: destLng}}
                title={this.state.endStopName}
                name={this.state.endStopName}
                onClick={this.props.mapRef.onMarkerClick}
              />;

        let shapes = [];

        responseJson.shape.map((stop) => {
            shapes.push({lat: stop.lat, lng: stop.lon});            
        });        
    
        let busPolyline = <Polyline
                path={shapes}
                strokeColor="#0000FF"
                strokeOpacity={0.8}
                 strokeWeight={2} />;

        let center = {lat: startLat, lng: startLng}; 
        
        this.props.setQuickTimes(originMarker, endMarker, null, busPolyline, center);
    });
}

componentDidMount() {
    let options = [];
    fetch('/api/routeselection/allroutes')
    .then((response) => response.json())
    .then((responseJson) => {
        responseJson.routes.map((stop) => {
          let item = { value: stop, label: stop, className: 'list-group-item' };
          options.push(item);
        });

        this.setState({
            routes: options
         });
    });

}

  render() {
    //styles defined here
    let styles = {
      journeyPlannerContent: {
        height: '100%',
        width: '100%',
        textAlign: 'center',
        marginLeft: 0,
      },
      formSubmit: {
        width: '100%'
      },
      input: {
        fontSize: '15px'
      },
      directions: {
        display: this.state.showDirections ? 'block' : 'none',
        textAlign: 'left'
      },
      loading: {
        display: this.state.loading ? 'block' : 'none'
      },
     variation: {
        display: this.state.variationOpen ? 'block' : 'none'
     },
     startStop: {
        display: this.state.startStopOpen? 'block' : 'none'
    },
     destinationStop: {
        display: this.state.destinationStopOpen? 'block' : 'none'
    },
    calenderOpen: {
        display: this.state.calenderOpen ? 'block' : 'none'
    },
    submitOpen: {
        display: this.state.submitOpen ? 'block' : 'none'
    },
    eta: {
        color: 'green',
        display: 'inline-block',
        marginBottom: '5px'    
    },
    busArrival: {
        display: 'inline-block',
        marginBottom: '5px'
    },
    icons: {
        fontSize: '24px',
        paddingRight: '10px',
        display: 'inline-block'
    },
    details: {
        marginLeft: '20px'
    }
    }

    let variation = this.state.variationOpen ? 'variationOpen form-group' : 'variationClosed form-group';
    const defaultOption = null;

    return (
      <div style={styles.journeyPlannerContent} >
        {/* When form is submitted we call this.props.submit which in the Nav compoent calls this.props.submit which calls the submit function in the Main componet */}
        <form onSubmit={this.submit}>
            <div className="form-group">
                <Dropdown 
                   className='quickTimesDropdown' 
                   menuClassName='list-group makeScroll' 
                   options={this.state.routes} 
                   onChange={this._onSelect1} 
                   value={defaultOption} 
                   placeholder={this.state.selected} 
                />
            </div>
            <div className="form-group" style={styles.variation}>
                <Dropdown
                   className="quickTimesDropdown"
                   menuClassName='list-group makeScroll'
                   options={this.state.variations}
                   onChange={this._onSelect2}
                   value={defaultOption}
                   placeholder={this.state.selectedVariation}
                /> 
            </div>
            <div className="form-group" style={styles.startStop}>
                <Dropdown
                   className='quickTimesDropdown'
                   menuClassName='list-group makeScroll'
                   options={this.state.startStops}
                   onChange={this._onSelect3}
                   value={defaultOption}
                   placeholder={this.state.selectedStartStop}
                /> 
            </div>
            <div className="form-group" style={styles.destinationStop}>
                <Dropdown
                   className='quickTimesDropdown'
                   menuClassName='list-group makeScroll'
                   options={this.state.endStops}
                   onChange={this._onSelect4}
                   value={defaultOption}
                   placeholder={this.state.selectedDestiantion}
                /> 
            </div>
            <div className="form-group" style={styles.calenderOpen}>
                <Calendar handleDate={this.handleDate} placeholder="Date & Time" />
            </div>
            <div className="form-group" style={styles.submitOpen}>
                <button type="submit" className="btn btn-info" style={styles.formSubmit}> Submit </button>
            </div>
            <div style={styles.loading}>
                <ReactLoading type={"bubbles"} color="rgb(3, 79, 152)" height={'100%'} width={'100%'}/>
            </div>
            <div style={styles.directions}>
                <li className="list-group-item">
                    <i className="fa fa-map-marker" style={styles.icons}></i><p className="lead" style={styles.busArrival}>Next bus Arivving at:</p>
                    <p className="lead" style={styles.details}>{this.state.departureTime}</p>
                    <i className="fa fa-hourglass-2" style={styles.icons}></i><p className="lead" style={styles.eta}>ETA:</p>
                    <p className="lead" style={styles.details}>{this.state.eta}</p>
                </li>
            </div>
        </form>
      </div>
    )
  }
}
