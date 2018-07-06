import React from "react"
import Form from "../components/form"

export default class Nav extends React.Component {
  render() {
    //styles defined here
    let styles = {
      menu: {
        width: '100%',
        position: 'relative',
        margin: '0',
        paddingTop: '1px',
        paddingBottom: '10px',
        backgroundColor: '#46494b',
        color: 'white',
      },
      sidebar: {
        height: '100%',
        width: '25%',
        transition: 'left .3s ease-in-out',
        backgroundColor: '#65696c',
        display: this.props.display ? 'inline-block' : 'none',
        float: 'left',
        textAlign: 'center'
      }
    }
    return (
      <nav style={styles.sidebar}>
        <div style={styles.menu}>
          <h2>Menu</h2>
        </div>
        <div style={styles.menu}>
          <h2>Journey Planner</h2>
          <Form submit={this.props.submit} input={this.props.input} />
        </div>

      </nav>
    )
  }
}

