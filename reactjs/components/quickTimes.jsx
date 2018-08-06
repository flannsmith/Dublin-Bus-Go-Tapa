import React from "react";
import Calendar from "../components/calendar";
import ReactLoading from "react-loading";
import Dropdown from 'react-dropdown';

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

    //Set the state of the component, a dictionary of data we want to use/manipulate.
   this.state = {
     routes: null,
     variations: null,
     startStops: null,
     endStops: null,
     variation: null,
     rawStartStops: null,
     selected: "Select an option",
     selectedVariation: "Pick a direction:",
     selectedStartStop: "Start stop:",
     selectedDestiantion: "Destination stop:",
     startStopName: null,
     endStopName: null
   }
}

_onSelect1(option) {
  this.setState({selected: option}, this.fillVariations(option));
}

fillVariations(option){
  console.log("Entered fillVariations");
  console.log(option);
  let variation = String(option.value);
  let options = [];

  fetch('/api/routeselection/routevariations/'+variation)
    .then((response) => response.json())
    .then((responseJson) => {
          let i = 0;
          responseJson[variation].map((variation) => {
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
    selectedVariation: option.value
    }, 
   this.fillStartStops(option));
}

fillStartStops(option){
  let route = String(this.state.selected.value);
  console.log("Entered startStops");
  console.log(option);
  let stop = option.value;
  let options = [];

 fetch('/api/routeselection/routestops/'+route+'/'+stop)
    .then((response) => response.json())
    .then((responseJson) => {
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
    startStopName: option.label
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
    endStopName: option.label
    },
   this.getShapes(option));
}

getShapes(option){
  let route = String(this.state.selected.value);
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
          responseJson.shape.map((stop) => {
            
            options.push(item);
          });
        this.setState({
            startStops: options,
            rawStartStops: responseJson
         });
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
        display: this.props.showDirections ? 'block' : 'none'
      },
      loading: {
        display: this.props.loading ? 'block' : 'none'
      }
    }

    const defaultOption = null;

    return (
      <div style={styles.journeyPlannerContent} >
        {/* When form is submitted we call this.props.submit which in the Nav compoent calls this.props.submit which calls the submit function in the Main componet */}
        <form onSubmit={this.props.submit}>
            <div className="form-group">
                <Dropdown 
                   className='quickTimesDropdown' 
                   menuClassName='list-group makeScroll' 
                   options={this.state.routes} 
                   onChange={this._onSelect1} 
                   value={defaultOption} 
                   placeholder={this.state.selected.value} 
                />
            </div>
            <div className="form-group">
                <Dropdown
                   className='quickTimesDropdown'
                   menuClassName='list-group makeScroll'
                   options={this.state.variations}
                   onChange={this._onSelect2}
                   value={defaultOption}
                   placeholder={this.state.selectedVariation}
                /> 
            </div>
            <div className="form-group">
                <Dropdown
                   className='quickTimesDropdown'
                   menuClassName='list-group makeScroll'
                   options={this.state.startStops}
                   onChange={this._onSelect3}
                   value={defaultOption}
                   placeholder={this.state.selectedStartStop}
                /> 
            </div>
            <div className="form-group">
                <Dropdown
                   className='quickTimesDropdown'
                   menuClassName='list-group makeScroll'
                   options={this.state.endStops}
                   onChange={this._onSelect4}
                   value={defaultOption}
                   placeholder={this.state.selectedDestiantion}
                /> 
            </div>
            <div className="form-group">
                <Calendar handleDate={this.props.handleDate} placeholder="Date & Time" />
            </div>
            <div className="form-group">
                <button type="submit" className="btn btn-info" style={styles.formSubmit}> Submit </button>
            </div>
            <div style={styles.loading}>
                <ReactLoading type={"bubbles"} color="rgb(3, 79, 152)" height={'100%'} width={'100%'}/>
            </div>
            <div style={styles.directions}>
                <li className="list-group-item">
                    <p className="lead">ETA:</p>
                    <p className="lead">{this.props.eta}</p>
                </li>
            </div>
        </form>
      </div>
    )
  }
}


