import React, { Component } from 'react';

export default class Fav extends React.Component {
   constructor(props) {
    super(props);

    }
render(){
    let styles={
        formSubmit: {
        width: '100%'
      },
        input: {
        fontSize: '15px'
      }

     }
    return (
        <div>
      <p>  Add your favourites</p>
        <form onSubmit={this.props.submit}>
            <div class="form-group">
                <input type="text" style={styles.input} name="dest" className="form-control" placeholder="Enter a favourite destination e.g Ballsbridge"/>
            </div>
            <div>
                <input type="text" style={styles.input} name="dest" className="form-control" placeholder="Enter the name for the destination e.g Office"/>
            </div>
            <button type="submit" class="btn btn-info" style={styles.formSubmit}> Submit </button>
        </form>
    </div>
    )
}
}
