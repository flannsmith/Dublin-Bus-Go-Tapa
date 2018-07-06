import React from "react"
import Nav from "../components/nav"
import MapContainer from "../components/mapContainer"
import Form from "../components/form"

export default class Main extends React.Component {
  constructor(props) {
   super(props);

   this.toggleNavBar = this.toggleNavBar.bind(this);
   this.handleInputChange = this.handleInputChange.bind(this);
   this.handleSubmit = this.handleSubmit.bind(this);
   this.resetDraw = this.resetDraw.bind(this);

   this.state = {
     sidebarOpen: false,
     start: '',
     stop: '',
     day: '',
     time: '',
     drawRoute: false
   };
 }

 handleInputChange(event) {
   const target = event.target;
   const value = target.value;
   const name = target.name;
   this.setState({
     [name]: value
   });
 }

 handleSubmit(event) {
   alert('Submitted');
   event.preventDefault();
   this.setState({
     drawRoute: true
   });
 }

 resetDraw(event) {
   this.setState({
     drawRoute: false
   });
 }

  toggleNavBar() {
    // funtion to toggle nav bar, this function is passed as a prop to the <MapContainer> component
    this.setState({sidebarOpen: !this.state.sidebarOpen}); //toggles sidebarOpen value
  }

  render() {

    let isSidebarOpen = this.state.sidebarOpen ? true : false;
    let isMapContainerWide = this.state.sidebarOpen ? true : false;

    return (
      <div>
        <Nav display={isSidebarOpen} submit={this.handleSubmit} input={this.handleInputChange} />
        <MapContainer display={isMapContainerWide} onClick={this.toggleNavBar} route={this.state} reset={this.resetDraw}/>
      </div>
    )
  }
}

