import React from "react"
import Calendar from "../components/calendar"
import ReactLoading from "react-loading";
import JourneySearchInput from "./journeyPlannerSearchInput"

export default class Form extends React.Component {
   constructor(props) {
    super(props);
    //Define all the  functions that are to be bound to this component. This is needed as when bable compiles all jsx files into one big bundle the browser will not be able define what "this" is related to. Doing these bindings configures it so the browser knows they are related to this compoent (class).
    this.handleDate = this.handleDate.bind(this);
    //Set the state of the component, a dictionary of data we want to use/manipulate.
    this.state = {
        date: null     
    }
}

    handleDate(date){
        this.setState({date: date._d.valueOf()}, () => console.log(this.state.date)); 
    };
  render() {
    //styles defined here
    let styles = {
      journeyPlannerContent: {
        height: '100%',
        width: '100%',
        textAlign: 'center',
        marginLeft: 0,
      },
      formSubmit: {
        width: '100%'
      },
      input: {
        fontSize: '15px'
      },
      directions: {
        display: this.props.showDirections ? 'block' : 'none'
      },
      loading: {
        display: this.props.loading ? 'block' : 'none'
      }
    }
    return (
      <div style={styles.journeyPlannerContent} >
        {/* When form is submitted we call this.props.submit which in the Nav compoent calls this.props.submit which calls the submit function in the Main componet */}
        <form onSubmit={this.props.submit}>
       		<div class="form-group">
    			{/* Same function call process as above but for input */}
                <JourneySearchInput journeyPlannerFormStart={this.props.journeyPlannerFormStart} />
				//<input type="text" style={styles.input} name="start" className="form-control" placeholder="Departing from: eg. Abbey Street" onChange={this.props.input} />
 			 </div>
			<div class="form-group">
                <JourneySearchInput journeyPlannerFormEnd={this.props.journeyPlannerFormEnd} />
               // <input type="text"  style={styles.input} name="stop" className="form-control" placeholder="Destination: eg. Howth" onChange={this.props.input} />
             </div> 
          <div class="form-group">
			<Calendar handleDate={this.handleDate} placeholder="Date & Time" />
      	  </div> 
		<div class="form-group">
			<button type="submit" class="btn btn-info" style={styles.formSubmit}> Submit </button>
          </div>
        <div style={styles.loading}>
           <ReactLoading type={"bubbles"} color="rgb(3, 79, 152)" height={'100%'} width={'100%'}/>
          </div>        
         <div style={styles.directions}>
           <li class="list-group-item">
            <p class="lead">ETA:</p>
            <p class="lead">{this.props.eta}</p>
           </li>
            {this.props.userDirections}
          </div>    
        </form>
      </div>
    )
  }
}

