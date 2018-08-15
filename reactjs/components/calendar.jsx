import React from 'react';

import DateTime from 'react-datetime';
//import '../DateTime.css';

export default class Calendar extends React.Component {
  render(){

  var yesterday = DateTime.moment().subtract( 1, 'day' );
  var fiveDay = DateTime.moment().add( 4, 'day' );
  var valid = function( current ){
    return current.isAfter( yesterday ) && current.isBefore(fiveDay);
  };

    return (
      <div id="calender">
        <DateTime className="calenderDiv" isValidDate={ valid } placeholder="Date & Time" onChange={this.props.handleDate}/>
      </div>
        )
    }
}
