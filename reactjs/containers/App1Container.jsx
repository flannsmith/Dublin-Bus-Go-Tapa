import React from "react"

import Headline from "../components/Headline"
import Aboutparagraph from "../components/aboutparagraph"

export default class App1Container extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <Headline>Sample App!</Headline>
            <Aboutparagraph text="Look Diarmuids first component"></Aboutparagraph>
          </div>
        </div>
      </div>
    )
  }
}
