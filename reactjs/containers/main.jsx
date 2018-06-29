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
    this.setState({sidebarOpen: !this.state.sidebarOpen});
    console.log(this.state.sidebarOpen);
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
