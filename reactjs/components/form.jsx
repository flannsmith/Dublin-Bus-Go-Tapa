import React from "react"
import Calendar from "../components/calendar"

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
        float: 'left',
        textAlign: 'center',
        marginLeft: 0,
      },
      formSubmit: {
        width: '100%'
      }
    }
    return (
      <div style={styles.journeyPlannerContent} >
        {/* When form is submitted we call this.props.submit which in the Nav compoent calls this.props.submit which calls the submit function in the Main componet */}
        <form onSubmit={this.props.submit}>
       		<div class="form-group">
    			{/* Same function call process as above but for input */}
				<input type="text"  name="start" className="form-control" placeholder="Departing from: eg. Abbey Street" onChange={this.props.input} />
 			 </div>
			<div class="form-group">
                <input type="text"  name="stop" className="form-control" placeholder="Destination: eg. Howth" onChange={this.props.input} />
             </div> 
          <div class="form-group">
			<Calendar handleDate={this.handleDate} />
      	  </div> 
		 {/* <div style={styles.dayTime}>
            <div style={styles.day}>
              <label>
                Day
                <input style={styles.formInput} name="day" type="text"  onChange={this.props.input} />
              </label>
            </div>
            <div style={styles.time}>
              <label>
                Time
                <input style={styles.formInput} style={styles.formInput} name="time" type="text" onChange={this.props.input} />
              </label>
            </div>
          </div> */}
		<div class="form-group">
			<button type="submit" class="btn btn-info" style={styles.formSubmit}> Submit </button>
          </div>

        </form>
      </div>
    )
  }
}

