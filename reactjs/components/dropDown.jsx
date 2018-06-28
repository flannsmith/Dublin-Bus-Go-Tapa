import React, { Component } from 'react';

export default class Dropdown extends Component {
  constructor() {
    super();

    this.state = {
      showMenu: false,
    }

    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  showMenu(event) {
    event.preventDefault();

    this.setState({ showMenu: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  }

  closeMenu() {
    this.setState({ showMenu: false }, () => {
      document.removeEventListener('click', this.closeMenu);
    });
  }

  render() {
    let styles = {
      drop_down: {
        display: 'inline-block',
        position: 'relative',
      },
      drop_down__button:{
        background: 'linearGradient(to right,#3d6def, #8FADFE)',
        display: 'inline-block',
        lineHeight: '40px',
        padding: '0 18px',
        textAlign: 'left',
        borderRadius: '4px',
        boxShadow: '0px 4px 6px 0px rgba(0,0,0,0.2)',
        cursor: 'pointer',
      },
      drop_down__menu_box: {
        position: 'absolute',
        width: '100%',
        left: 0,
        backgroundColor: '#fff',
        borderRadius: '4px',
        boxShadow: '0px 3px 6px 0px rgba(0,0,0,0.2)',
        transition: 'all 0.3s',
        WebkitTransition: 'all 0.3s',
        MozTransition: 'all 0.3s',
        MsTransition: 'all 0.3s',
        OTransition: 'all 0.3s',
        opacity: 1,
        marginTop: '5px',
      },
      drop_down__menu: {
        margin: 0,
        padding: '0 13px',
        listStyle: 'none',
      },
      drop_down__item:{
        fontSize: '13px',
        padding: '13px 0',
        textAlign: 'left',
        fontWeight: 500,
        color: '#909dc2',
        cursor: 'pointer',
        position: 'relative',
        borderBottom: '1px solid #e0e2e9'
      }

    }

    return (
      <div style={styles.drop_down}>
        <div onClick={this.showMenu} style={styles.drop_down__button}>
          Show menu
        </div>

        {
          this.state.showMenu
            ? (
              <div style={styles.drop_down__menu_box}>
                <ul style={styles.drop_down__menu}>
                  <li style={styles.drop_down__item}> Menu item 1 </li>
                  <li style={styles.drop_down__item}>  Menu item 2 </li>
                  <li style={styles.drop_down__item}> Menu item 3 </li>
                </ul>
              </div>
            )
          : (
            null
          )
        }
      </div>
    );
  }

}

