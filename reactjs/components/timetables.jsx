import Dropdown from 'react-dropdown';
import React from "react";

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

    this.state = {
        //set state of componet here this is data you want you componet to hold
        //ex. day: 1
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
        timeTable: null
    };
}

componentDidMount() {
    console.log("Fetching routes");
    let options = [];
    fetch('/api/routeselection/allroutes')
    .then((response) => response.json())
    .then((responseJson) => {
        responseJson.routes.map((stop) => {
          let item = { value: stop, label: stop, className: 'list-group-item' };
          options.push(item);
        });
        console.log(options);
        this.setState({
            allRoutes: options
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
  let timetables = null;
  //API fetch goes here using above stop number.
  //do something wiht returned data, ie. put in a html div or table to be displayed, then set as timeTable state.
    fetch('/api/timetables/'+stopNumber)
    .then((response) => response.json())
    .then((responseJson) => {
    //console.log(responseJson.stopNumber[0].arrive);
    //console.log(responseJson["timetable"][0].arrive)
    timetables="<h3>Timetable for stop " + stopNumber + "</h3>"
    timetables+="<tb><thead><td>Arrival time</td><td>Route</td></thead><tr>"
    responseJson["timetable"].map((stopTimetable)=>{
    //console.log(stop_tt.arrive);
    timetables+="<td>" + stopTimetable.arrive + "</td><td>" + stopTimetable.route + "</td></tr>"
   });
    timetables+="</tb>";

    //let timetables = null; //change null to html data.
    this.setState({
     timeTable: timetables
  });
 });
}



render() { 
    //styles defined here
    let styles = {
		//example below
	//	timetable: {
	//		height: '100%',
	//	},
    }
	//Access styles in html elements through inline styling, ex. <div style={styles.timetable}> </div>
    //html elements go inside return below.

    const defaultOption = null;

	return (
       <div>
         <div className="form-group">
             <Dropdown
               className='quickTimesDropdown'
               menuClassName='list-group makeScroll'
               options={this.state.allRoutes}
               onChange={this._onSelect1}
               value={defaultOption}
               placeholder={this.state.routePlace}
             />
         </div>
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
         <div className="form-group">
                <Dropdown
                   className='quickTimesDropdown'
                   menuClassName='list-group makeScroll'
                   options={this.state.startStops}
                   onChange={this._onSelect3}
                   value={defaultOption}
                   placeholder={this.state.stopPlace}
                />
          </div>
          {this.state.timeTable}
        </div>
		)
	}
}
