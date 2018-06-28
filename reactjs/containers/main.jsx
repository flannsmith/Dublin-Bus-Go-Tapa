import React from "react"
import Nav from "../components/nav"
import MapContainer from "../components/mapContainer"

export default class Main extends React.Component {
  render() {
    return (
		<div>
        	<Nav />
        	<MapContainer />
      	</div>
    )
  }
}

