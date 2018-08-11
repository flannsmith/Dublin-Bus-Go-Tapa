import React from "react"
import Form from "../components/form"
import Fav from "../components/favourites"
import QuickTimes from "../components/quickTimes"
import Timetables from "../components/timetables"

export default class Nav extends React.Component {
 constructor(props) {
    super(props);
    
    this.toggleQuickTimes = this.toggleQuickTimes.bind(this);
    this.toggleFavourites = this.toggleFavourites.bind(this);
    this.toggleTimetables = this.toggleTimetables.bind(this);
    this.logoutUser = this.logoutUser.bind(this) 

    this.state = {    
        quickTimes: false,
        favourites: false,
        timetables: false
    };
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
        display: this.props.journeyPlanner ? 'block' : 'none',
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

    let nav_class = this.props.display ? "sidebarOpen" : "sidebarClosed";
    let button_class = this.props.display ? "buttonOpen" : "buttonClosed";
    
    return (
      <nav className={nav_class}>
        <div style={styles.menu}>
           <div ref='yButton' onClick={e => this.props.onClick(e, this.refs.yButton)} className={button_class}>
                  <div className="divButton"></div>
                  <div className="bar1side"></div>
                  <div className="bar2side"></div>
                  <div className="bar3side"></div>
             </div>
           <img src={'/static/images/GoTapaLogo.png'} /> 
        <div className="panel panel-default">
          <div className="panel-heading" onClick={this.props.toggleJourneyPlanner}>
             <h3 className="panel-title">Journey Planner</h3>
           </div>
           <div className="panel-body" style={styles.journeyPlanner}>
            {/* Form compoent that passes submit function and input funciton as props, which in turn is a prop of this fucntion. The Main componet holds the data for these funcions. */}
               <Form secondLocationOpen={this.props.secondLocationOpen} calenderOpen={this.props.calenderOpen} submitOpen={this.props.submitOpen} isGoogleLoaded={this.props.isGoogleLoaded} handleDate={this.props.handleDate} submit={this.props.submit} eta={this.props.time} loading={this.props.loading} journeyPlannerFormStart={this.props.journeyPlannerFormStart} journeyPlannerFormEnd={this.props.journeyPlannerFormEnd} showDirections={this.props.showDirections} input={this.props.input} userDirections={this.props.userDirections} />
            </div>
            <div className="panel-heading" onClick={this.toggleQuickTimes}>
             <h3 className="panel-title">Quick Times</h3>
            </div>
            <div className="panel-body" style={styles.quickTimes}>
             <QuickTimes mapRef={this.props.mapRef} setQuickTimes={this.props.setQuickTimes} />
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
                <Timetables isGoogleLoaded={this.props.isGoogleLoaded} currentLocationLat={this.props.currentLocationLat} currentLocationLon={this.props.currentLocationLon} setTimeTables={this.props.setTimeTables} />
            </div>
            <div className="panel-heading" onClick={this.props.userProfile}>
                <h3 className="panel-title">View Your profile</h3>
            </div>
            <div className="panel-heading" onClick={this.logoutUser}>
                <h3 className="panel-title">Logout</h3>
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

