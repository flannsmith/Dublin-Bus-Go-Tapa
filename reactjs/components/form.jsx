import React from "react"

export default class Form extends React.Component {

  render() {
    //styles defined here
    let styles = {
      journeyPlannerContent: {
        height: '100%',
        width: '100%',
        float: 'left',
        textAlign: 'center',
        marginLeft: 0,
        paddingTop: '20px'
      },
      formInput: {
        color: 'black'
      }
    }
    return (
      <div style={styles.journeyPlannerContent} >
        {/* When form is submitted we call this.props.submit which in the Nav compoent calls this.props.submit which calls the submit function in the Main componet */}
        <form onSubmit={this.props.submit}>

          <div style={styles.startStop}>
            <div style={styles.start}>
              <label>
                <h4>"Start: (Stop ID)"</h4>
                {/* Same function call process as above but for input */}
                <input style={styles.formInput} name="start" type="text"  onChange={this.props.input} />
              </label>
            </div>
            <div style={styles.stop}>
              <label>
                <h4>"Stop: (Stop ID)"</h4>
                {/* Same function call process as above but for input */}
                <input style={styles.formInput} name="stop" type="text"  onChange={this.props.input} />
              </label>
            </div>
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

          <div style={styles.go}>
            <input style={styles.formInput} type="submit" value="Submit" />
          </div>

        </form>
      </div>
    )
  }
}

