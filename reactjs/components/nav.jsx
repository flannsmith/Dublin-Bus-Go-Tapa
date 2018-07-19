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
        color: 'white',
        borderBottom: '4px solid rgb(238, 239, 241)'
      },
      sidebar: {
        height: '100%',
        width: '25%',
        transition: 'left .3s ease-in-out',
        display: this.props.display ? 'inline-block' : 'none',
        float: 'left',
        textAlign: 'center',
        backgroundColor: 'slategray'
      }
    }
    return (
      <nav style={styles.sidebar}>
        <div style={styles.menu}>
          <h2>Menu</h2>
        </div>
        <div style={styles.menu}>
          <h2>Journey Planner</h2>
          {/* Form compoent that passes submit function and input funciton as props, which in turn is a prop of this fucntion. The Main componet holds the data for these funcions. */}
          <Form submit={this.props.submit} input={this.props.input} /> 
        </div>
      </nav>
    )
  }
}

