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
   this.isGoogleLoaded = this.isGoogleLoaded.bind(this);
   this.toggleJourneyPlanner = this.toggleJourneyPlanner.bind(this);
   this.setStartEndMarker = this.setStartEndMarker.bind(this);
   this.setDirectionMpolyline = this.setDirectionMpolyline.bind(this);
   this.setQuickTimes = this.setQuickTimes.bind(this);
   this.resetCenter = this.resetCenter.bind(this);
   this.setMapRef = this.setMapRef.bind(this);
   this.setTimeTables = this.setTimeTables.bind(this);
   this.toggleDirections = this.toggleDirections.bind(this);
   this.toggleTimetable = this.toggleTimetable.bind(this);
   this.getUserDetails = this.getUserDetails.bind(this);
   this.setCurrentLocation = this.setCurrentLocation.bind(this);
   this.toggleUser = this.toggleUser.bind(this);

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
     directionMarkers: null,
     polyline: null,
     routeShape: null,
     isGoogleLoaded: false,
     journeyPlanner: false,
     center: false,
     mapRef: null,
     setTimeTables: null,
     mapToggleDisabeled: true,
     timetables: null,
     secondLocationOpen: false,
     calenderOpen: false,
     submitOpen: false,
     currentLocationLat: 53.3082648, //users current latitude, defaults to UCD
     currentLocationLon: -6.22363949999999,  //users current longitude, defaults to UCD
     userDetails: null,
     displayUser: false
   };
 }

 setMapRef(value){
    this.setState({
        mapRef: value
    });
 }

 resetCenter(){
    this.setState({
        center: false
    });
 }

 setQuickTimes(startM, endM, directionM, polyline, center){
    console.log("CHECK IF EXECUTING");
    this.setState({
        startMarker: startM,
        endMarker: endM,
        directionMarkers: directionM,
        polyline: polyline,
        center: center,
        sidebarOpen: false
    });
 }
 
 setStartEndMarker(startM, endM){
    this.setState({
        startMarker: startM,
        endMarker: endM
    });
 }

 setTimeTables(timetable){
    this.setState({
        timetables: timetable,
        displayTimetables: true,
        showDirections: false,
        mapToggleDisabeled: false,
        displayUser: false
    });
 }

 setCurrentLocation(lat, lng){
    this.setState({
        currentLocationLat: lat,
        currentLocationLng: lng
    });
 }

 toggleDirections(){
    this.setState({
        showDirections: !this.state.showDirections,
    });
 }

 toggleTimetable(){
    this.setState({
        displayTimetables: !this.state.displayTimetables,
    });
 }

 toggleUser(){
    this.setState({
        displayUser: !this.state.displayUser,
    });
 }

 setDirectionMpolyline(directionM, polyline){
    this.setState({
        directionMarkers: directionM,
        polyline: polyline
    });
 }

 toggleJourneyPlanner(){
    this.setState({
        journeyPlanner: !this.state.journeyPlanner
    });
 }


 showDirections(directions){
   this.setState({
    userDirections: directions,
    loading: false,
    showDirections: true,
    displayTimetables: false,
    mapToggleDisabeled: false,
    displayUser: false
   });
 }

 handleDate(date){
   this.setState({
    date: date._d,
    submitOpen: true
    }, () => console.log(date, date._d.getTime()));
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
     displayTimetables: false,
     displayUser: false,
     drawRoute: true,
     loading: true,
     sidebarOpen: false
   });
 }
 handleSubmitFav(event){
     event.preventDefault();
     fetch('/favourites/we/rfr',{method: "GET", credentials: 'same-origin'})
 }

isGoogleLoaded(value){
   this.setState({
     isGoogleLoaded: value
   });
}

 journeyPlannerFormStart(originName, startLat, startLng){
   this.setState({
    originName: originName,
    startLat: startLat,
    startLng: startLng,
    secondLocationOpen: true,
    calenderOpen: false,
    submitOpen: false
   });
 }

 journeyPlannerFormEnd(destinationName, destLat, destLng, destLatLng){
   this.setState({
    destinationName: destinationName,
    destLat: destLat,
    destLng: destLng,
    destLatLng: destLatLng,
    calenderOpen: true,
    submitOpen: false
   });
 }

 showDirectionFromLocation(){
    this.setState({
     showDirections: false,
     displayTimetables: false,
     displayUser: false,
     loading: true,
     mapToggleDisabeled: false
   });
 }

getUserDetails(){
    console.log("in get user details");
    //let username = '';
    let points = 0;
    let userProfile=[];
    fetch('/api/get-user-profile',{method: "GET", credentials: 'same-origin'})
    .then((response) => response.json())
    .then((responseJson) =>{
    console.log(responseJson);
    let username = responseJson.username;
    console.log(username)
    points = responseJson.points;
    userProfile.push(<div><h2>Username: {username}</h2><h3>Co2 Reduction Points: {points}</h3><h2>Leaderboard</h2>);
    responseJson.leaderboard.map((lboardpoints)=>{
    userProfile.push(<tr><td>{lboardpoints.use}r</td><td>{lboardpoints.points}</td></tr>)
     });
    userProfile.push(</div>);
    
    
    this.setState({
        userDetails: userProfile,
        loading: false,
        showDirections: false,
        displayTimetables: false,
        mapToggleDisabeled: false,
        displayUser: true
     });
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
        <Nav currentLocationLat={this.state.currentLocationLat} currentLocationLon={this.state.currentLocationLon}  userProfile={this.getUserDetails} secondLocationOpen={this.state.secondLocationOpen} calenderOpen={this.state.calenderOpen} submitOpen={this.state.submitOpen}  onClick={this.toggleNavBar} setTimeTables={this.setTimeTables} mapRef={this.state.mapRef} setQuickTimes={this.setQuickTimes} journeyPlanner={this.state.journeyPlanner} toggleJourneyPlanner={this.toggleJourneyPlanner} isGoogleLoaded={this.state.isGoogleLoaded} showMarkers={this.showMarkers} handleDate={this.handleDate} time={this.state.eta} display={isSidebarOpen} submit={this.handleSubmit} input={this.handleInputChange} loading={this.state.loading} journeyPlannerFormStart={this.journeyPlannerFormStart} journeyPlannerFormEnd={this.journeyPlannerFormEnd} showDirections={this.state.showDirections} userDirections={this.state.userDirections} submit_fav={this.handleSubmitFav}/>
        <div className="fullHeight">
           <MapContainer toggleDirections={this.toggleDirections} toggleUser={this.toggleUser} setCurrentLocation={this.setCurrentLocation} toggleTimetable={this.toggleTimetable} setMapRef={this.setMapRef} resetCenter={this.resetCenter} setDirectionMpolyline={this.setDirectionMpolyline} setStartEndMarker={this.setStartEndMarker} isGoogleLoaded={this.isGoogleLoaded} display={isMapContainerWide} setTime={this.setTime} onClick={this.toggleNavBar} route={this.state} reset={this.resetDraw} showDirections={this.showDirections} showDirectionFromLocation={this.showDirectionFromLocation}/>
        </div>  
    </div>
    )
  }
}

