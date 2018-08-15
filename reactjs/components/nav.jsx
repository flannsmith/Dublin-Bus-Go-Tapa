import React from "react"
import Form from "../components/form"
import Fav from "../components/favourites"
import QuickTimes from "../components/quickTimes"
import Timetables from "../components/timetables"
import LogoutUser from "../components/logoutUser"
//import {browserHistory} from 'react-router';
import { Redirect } from 'react-router-dom'

export default class Nav extends React.Component {
 constructor(props) {
    super(props);
    
    this.logoutUser = this.logoutUser.bind(this) 

    this.state = {    
        quickTimes: false,
        favourites: false,
        timetables: false
    };
}
/*
toggleQuickTimes(){
    this.setState({
        quickTimes: !this.state.quickTimes,
        favourites: false,
        timetables: false
    });
}

toggleFavourites(){
    this.setState({
        favourites: !this.state.favourites,
        timetables: false,
        quickTimes: false
    });
}

toggleTimetables(){
    this.setState({
        timetables: !this.state.timetables,
        quickTimes: false,
        favourites: false
    });
}
*/
logoutUser(){
    console.log(React.version);
 //   this.preventDefault();
    fetch('/logout',{method: "GET", credentials: 'same-origin'})
  //  browserHistory.push('/');
  //  var transitionTo = Router.transitionTo;
   // transitionTo('your_route_name', query={keyword: input_value});
   return <Redirect to='/' />
  //  window.locaton='/';
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
        display: this.props.quickTimes ? 'block' : 'none',
      },
      timetables: {
        display: this.props.timetables ? 'block' : 'none',
      },
      image: {
        width: '70%'
      },
      hideDiv: {
        display: 'none'
    },
      icon: {
        fontSize: '24px',
        float: 'right'
    },
      iconLeft: {
        fontSize: '24px',
        paddingRight: '15px'
    },
     panel: {
        marginTop: '50px',
        textAlign: 'left'
    },
    panelTitle: {
        display: 'inline-block'
    }
    }

    let nav_class = this.props.display ? "sidebarOpen" : "sidebarClosed";
    let button_class = this.props.display ? "buttonOpen" : "buttonClosed";
    
    return (
      <nav className={nav_class}>
        <div style={styles.menu}>
           <div style={styles.hideDiv}></div>
           <div ref='yButton' onClick={e => this.props.onClick(e, this.refs.yButton)} className={button_class}>
                  <div className="divButton"></div>
                  <div className="bar1side"></div>
                  <div className="bar2side"></div>
                  <div className="bar3side"></div>
             </div>
           <img src={'/static/images/GoTapaLogo.png'} style={styles.image} /> 
        <div className="panel panel-default" style={styles.panel}>
          <div className="panel-heading phead" onClick={this.props.toggleJourneyPlanner}>
             <i className="fa fa-bus" style={styles.iconLeft}></i><h3 className="panel-title" style={styles.panelTitle}>Journey Planner</h3><i className="fa fa-angle-down" style={styles.icon}></i>
           </div>
           <div className="panel-body pbody" style={styles.journeyPlanner}>
            {/* Form compoent that passes submit function and input funciton as props, which in turn is a prop of this fucntion. The Main componet holds the data for these funcions. */}
               <Form secondLocationOpen={this.props.secondLocationOpen} calenderOpen={this.props.calenderOpen} submitOpen={this.props.submitOpen} isGoogleLoaded={this.props.isGoogleLoaded} handleDate={this.props.handleDate} submit={this.props.submit} eta={this.props.time} loading={this.props.loading} journeyPlannerFormStart={this.props.journeyPlannerFormStart} journeyPlannerFormEnd={this.props.journeyPlannerFormEnd} showDirections={this.props.showDirections} input={this.props.input} userDirections={this.props.userDirections} />
            </div>
            <div className="panel-heading phead" onClick={this.props.toggleQuickTimes}>
             <i className="fa fa-clock-o" style={styles.iconLeft}></i><h3 className="panel-title" style={styles.panelTitle}>Quick Times</h3><i className="fa fa-angle-down" style={styles.icon}></i>
            </div>
            <div className="panel-body pbody" style={styles.quickTimes}>
             <QuickTimes mapRef={this.props.mapRef} setQuickTimes={this.props.setQuickTimes} />
             </div>
            {/*<div className="panel-heading" onClick={this.toggleFavourites}>
                <h3 className="panel-title">Favourites</h3>
            </div>
            <div className="panel-body" style={styles.favourites}>
                <Fav submit={this.props.submit_fav}/>
            </div>*/}
            <div className="panel-heading phead" onClick={this.props.toggleTimetables}>
                <i className="fa fa-calendar" style={styles.iconLeft}></i><h3 className="panel-title" style={styles.panelTitle}>Timetables</h3><i className="fa fa-angle-down" style={styles.icon}></i>
            </div>
            <div className="panel-body pbody" style={styles.timetables}>
                <Timetables setMapTimetable={this.props.setMapTimetable} mapRef={this.props.mapRef}  isGoogleLoaded={this.props.isGoogleLoaded} currentLocationLat={this.props.currentLocationLat} currentLocationLon={this.props.currentLocationLon} setTimeTables={this.props.setTimeTables} />
            </div>
            <div className="panel-heading phead" onClick={this.props.userProfile}>
                <i className="fa fa-user" style={styles.iconLeft}></i><h3 className="panel-title" style={styles.panelTitle}>View Your profile</h3>
            </div>
            {/*<form action='/logout' method="POST"> */}
            <a href="/logout">
                <div className="panel-body pbody" id="logout">
                    <i className="fa fa-sign-out" style={styles.iconLeft}></i><h3 className="panel-title" style={styles.panelTitle}>Logout</h3>
                </div>
            </a>        
            {/* </form>*/}                  
         
            
          </div>
        </div>
      </nav>
    )
  }
}

