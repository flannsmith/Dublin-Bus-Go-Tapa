import React from "react"

import Logo from "./logo.jsx"

export default class Header extends React.Component {

  render() {
    return (
      <div className="navbar fixed-top navbar-dark bg-primary">
        <Logo></Logo>
      </div>
    )
      }
  }

