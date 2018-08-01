import React from "react"
import Form from "../components/form"
import Fav from "../components/favourites"

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
        display: this.props.display ? 'block' : 'none',
        width: '50%',
        float: 'left',
        textAlign: 'center',
        backgroundColor: 'white',
        maxHeight: '100%',
        overflow: 'scroll',
        position: 'relative',
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
               <Form submit={this.props.submit} eta={this.props.time} loading={this.props.loading} journeyPlannerFormStart={this.props.journeyPlannerFormStart} journeyPlannerFormEnd={this.props.journeyPlannerFormEnd} showDirections={this.props.showDirections} input={this.props.input} userDirections={this.props.userDirections} />
            </div>
            <div className="panel-heading">
                <h3 className="panel-title">Favourites</h3>
            </div>
            <div className="panel-title">
                <Fav submit={this.props.submit_fav}/>
            </div>
            
                
            
        </div>
      </nav>
    )
  }
}

