//Import subcomponets
import React from "react"
import Nav from "../components/nav"
import MapContainer from "../components/mapContainer"
import Form from "../components/form"

export default class Main extends React.Component {
  constructor(props) {
   super(props);
   
   //Here we bind these functions to this component (class) if you do not do this when babel compiles all the react componets into the one large bundle script, the browser will not know what "this" is referring to
   this.toggleNavBar = this.toggleNavBar.bind(this);
   this.handleInputChange = this.handleInputChange.bind(this);
   this.handleSubmit = this.handleSubmit.bind(this);
   this.resetDraw = this.resetDraw.bind(this);
   this.showDirections = this.showDirections.bind(this);
   this.showDirectionFromLocation = this.showDirectionFromLocation.bind(this);
   this.setTime = this.setTime.bind(this);   
   this.handleSubmitFav = this.handleSubmitFav.bind(this)
   this.journeyPlannerFormStart = this.journeyPlannerFormStart.bind(this);
   this.journeyPlannerFormEnd = this.journeyPlannerFormEnd.bind(this);
   this.handleDate = this.handleDate.bind(this);
   this.showMarkers = this.showMarkers.bind(this);

    //set the state of this componet dictionary of data we want to store
   this.state = {
     formDisplay: true,
     sidebarOpen: false,
     start: '',
     stop: '',
     day: '',
     time: '',
     drawRoute: false,
     loading: false,
     showDirections: false,
     userDirections: null,
     eta: null,
     originName: null,
     startLat: null,
     startLng: null,
     destinationName: null,
     destLatLng: null,
     destLat: null,
     destLng: null,
     date: null,
     startMarker: null,
     endMarker: null,
     routeShape: null
   };
 }

 showMarkers(start, polylines, end){
    this.setState({
        startMarker: start,
        routeShape: polylines,
        endMarker: end
    });
}

 showDirections(directions){
   this.setState({
    userDirections: directions,
    loading: false,
    showDirections: true,
    sidebarOpen: true
   });
 }

 handleDate(date){
   this.setState({date: date._d}, () => console.log(date, date._d.getTime()));
 };

 //Gets input from form in Nav componet. This function is passed to the Nav componet below as a prop. ie. <Nav input={this.handleInputChange} />
 handleInputChange(event) {
   const target = event.target;
   const value = target.value;
   const name = target.name;
   this.setState({
     [name]: value
   });
 }

 // Handels submit event of form. This function is passed to the Nav componet below as a prop. ie. <Nav submit={this.handleSubmit} />
 handleSubmit(event) {
   event.preventDefault(); //stops default form submit which sends a http request and reloads the page.
   this.setState({
     showDirections: false,
     drawRoute: true,
     loading: true,
   });
 }
 handleSubmitFav(event){
     event.preventDefault();
     fetch('/favourites/we/rfr',{method: "GET", credentials: 'same-origin'})
 }

 journeyPlannerFormStart(originName, startLat, startLng){
   this.setState({
    originName: originName,
    startLat: startLat,
    startLng: startLng,
   });
 }

 journeyPlannerFormEnd(destinationName, destLat, destLng, destLatLng){
   this.setState({
    destinationName: destinationName,
    destLat: destLat,
    destLng: destLng,
    destLatLng: destLatLng
   });
 }

 showDirectionFromLocation(){
    this.setState({
     showDirections: false,
     drawRoute: true,
     loading: true,
     sidebarOpen: true
   });
 }

 //After drawing a route, changes the state back to false. This function is passed to the MapContainer componet which will draw the route. ie. <MapContainer reset={this.resetDraw} />
 resetDraw(event) {
   this.setState({
     drawRoute: false
   });
 }

  //Funtion to toggle nav bar, this function is passed as a prop to the MapContainer component. ie. <MapContainer onClick={this.toggleNavBar} />
  toggleNavBar(e, xButton) {
    this.setState({sidebarOpen: !this.state.sidebarOpen}); //toggles sidebarOpen value
    xButton.classList.toggle("change");
  }

  setTime(time) {
   this.setState({
     eta: time
   });
 }

  render() {
    //checks weather the sidebar is open or not in the state of this component and passes the variables as componets to the Nav and Mapcontainer to use in their CSS properties.
    let isSidebarOpen = this.state.sidebarOpen ? true : false;
    let isMapContainerWide = this.state.sidebarOpen ? true : false;
    //let isJourneyPlannerOpen = this.state.formDisplay ? false : true;
    return (
      <div id="mainContent" className="fullHeight">
        <Nav  showMarkers={this.showMarkers} handleDate={this.handleDate} time={this.state.eta} display={isSidebarOpen} submit={this.handleSubmit} input={this.handleInputChange} loading={this.state.loading} journeyPlannerFormStart={this.journeyPlannerFormStart} journeyPlannerFormEnd={this.journeyPlannerFormEnd} showDirections={this.state.showDirections} userDirections={this.state.userDirections} submit_fav={this.handleSubmitFav}/>
        <div className="fullHeight">
           <MapContainer display={isMapContainerWide} setTime={this.setTime} onClick={this.toggleNavBar} route={this.state} reset={this.resetDraw} showDirections={this.showDirections} showDirectionFromLocation={this.showDirectionFromLocation}/>
        </div>  
    </div>
    )
  }
}

