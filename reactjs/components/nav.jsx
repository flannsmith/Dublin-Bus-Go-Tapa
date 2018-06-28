import React from "react"

export default class Nav extends React.Component {
  render() {
    let styles = {
      nav: {
        float: 'left',
        height: '100%',
        width: '25%',
        position: 'fixed',
        zIndex: '+1'
      },
      menu: {
        width: '100%',
        position: 'relative',
      }
    }
    return (
      <nav style={styles.nav}>
        <div style={styles.menu}>
          <h2>Menu</h2>
        </div>

      </nav>
    )
  }
}
