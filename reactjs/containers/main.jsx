import React from "react"
import Nav from "../components/nav"
import MapContainer from "../components/mapContainer"

export default class Main extends React.Component {
  constructor(props) {
   super(props);

   this.toggleNavBar = this.toggleNavBar.bind(this);
   this.state = {sidebarOpen: false};
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
        <Nav display={isSidebarOpen} />
        <MapContainer display={isMapContainerWide} onClick={this.toggleNavBar} />
      </div>
    )
  }
}
