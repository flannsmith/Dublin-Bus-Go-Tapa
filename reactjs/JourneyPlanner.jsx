import React from "react"
import { render } from "react-dom"
import JourneyPlannerMain from "./containers/journeyPlannerMain"

class JourneyPlanner extends React.Component {
    render() {
        return (
                <JourneyPlannerMain> </JourneyPlannerMain>
               )
    }
}

render(<JourneyPlanner/>, document.getElementById('JourneyPlanner'))

