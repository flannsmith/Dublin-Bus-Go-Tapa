import React from "react"
import Form from "../components/form"
import ReactLoading from "react-loading";

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
      },
      sidebar: {
        width: '40%',
        transition: 'left .3s ease-in-out',
        display: this.props.display ? 'inline-block' : 'none',
        float: 'left',
        textAlign: 'center',
        backgroundColor: 'white'
      },
      loading: {
        display: this.props.loading ? 'block' : 'none'
      },
      directions: {
        display: this.props.showDirections ? 'block' : 'none'
      }
    }
    return (
      <nav style={styles.sidebar}>
        <div style={styles.menu}>
           <h3>Dublin Bus</h3>
        </div>
        <div className="panel panel-default">
          <div className="panel-heading">
             <h3 className="panel-title">Journey Planner</h3>
           </div>
           <div className="panel-body">
            {/* Form compoent that passes submit function and input funciton as props, which in turn is a prop of this fucntion. The Main componet holds the data for these funcions. */}
               <Form submit={this.props.submit} input={this.props.input} />
               <div style={styles.loading}>
                  <ReactLoading type={"bubbles"} color="#000" />
                </div>
                <div style={styles.directions}>
                    {this.props.userDirections}
                 </div>
            </div>
        </div>
      </nav>
    )
  }
}

