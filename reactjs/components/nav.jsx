import React from "react"
import Form from "../components/form"
import Fav from "../components/favourites"
import QuickTimes from "../components/quickTimes"
import Timetables from "../components/timetables"

export default class Nav extends React.Component {
 constructor(props) {
    super(props);
    
    this.toggleJourneyPlanner = this.toggleJourneyPlanner.bind(this);
    this.toggleQuickTimes = this.toggleQuickTimes.bind(this);
    this.toggleFavourites = this.toggleFavourites.bind(this);
    this.toggleTimetables = this.toggleTimetables.bind(this);
    this.logoutUser = this.logoutUser.bind(this) 

    this.state = {    
        journeyPlanner: false,
        quickTimes: false,
        favourites: false,
        timetables: false
    };
}

toggleJourneyPlanner(){
    console.log(this.state.journeyPlanner);
    console.log(!this.state.journeyPlanner);
    this.setState({
        journeyPlanner: !this.state.journeyPlanner
    });    
}

toggleQuickTimes(){
    this.setState({
        quickTimes: !this.state.quickTimes
    });
}

toggleFavourites(){
    this.setState({
        favourites: !this.state.favourites
    });
}

toggleTimetables(){
    this.setState({
        timetables: !this.state.timetables
    });
}
logoutUser(){
    //this.preventDefault();
    fetch('/logout',{method: "GET", credentials: 'same-origin'})
}


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
      },
      journeyPlanner: {
        display: this.state.journeyPlanner ? 'block' : 'none',
      },
      quickTimes: {
        display: this.state.quickTimes ? 'block' : 'none',
      },
      favourites: {
        display: this.state.favourites ? 'block' : 'none',
      },
      timetables: {
        display: this.state.timetables ? 'block' : 'none',
      }
    }
    return (
      <nav style={styles.sidebar}>
        <div style={styles.menu}>
           <h3>Dublin Bus</h3>
        </div>
        <div className="panel panel-default">
          <div className="panel-heading" onClick={this.toggleJourneyPlanner}>
             <h3 className="panel-title">Journey Planner</h3>
           </div>
           <div className="panel-body" style={styles.journeyPlanner}>
            {/* Form compoent that passes submit function and input funciton as props, which in turn is a prop of this fucntion. The Main componet holds the data for these funcions. */}
               <Form handleDate={this.props.handleDate} submit={this.props.submit} eta={this.props.time} loading={this.props.loading} journeyPlannerFormStart={this.props.journeyPlannerFormStart} journeyPlannerFormEnd={this.props.journeyPlannerFormEnd} showDirections={this.props.showDirections} input={this.props.input} userDirections={this.props.userDirections} />
            </div>
            <div className="panel-heading" onClick={this.toggleQuickTimes}>
             <h3 className="panel-title">Quick Times</h3>
            </div>
            <div className="panel-body" style={styles.quickTimes}>
             <QuickTimes showMarkers={this.props.showMarkers} />
             </div>
            <div className="panel-heading" onClick={this.toggleFavourites}>
                <h3 className="panel-title">Favourites</h3>
            </div>
            <div className="panel-body" style={styles.favourites}>
                <Fav submit={this.props.submit_fav}/>
            </div>
            <div className="panel-heading" onClick={this.toggleTimetables}>
                <h3 className="panel-title">Timetables</h3>
            </div>
            <div className="panel-body" style={styles.timetables}>
                <Timetables />
            </div>
            <div className="panel-heading" onClick={this.logoutUser}>
                <h3 className="panel-title">Logout</h3>
            </div>
        </div>
      </nav>
    )
  }
}

