import React from "react"

export default class Nav extends React.Component {
  render() {
    //styles defined here
    let styles = {
      menu: {
        width: '100%',
        position: 'relative',
        paddingLeft: '25%'
      },
      sidebar: {
        height: '100%',
        width: '25%',
        transition: 'left .3s ease-in-out',
        backgroundColor: 'blue',
          display: this.props.display ? 'inline-block' : 'none',
        float: 'left'
      }
    }
    return (
      <nav style={styles.sidebar}>
        <div style={styles.menu}>
          <h2>Menu</h2>
        </div>

      </nav>
    )
  }
}
