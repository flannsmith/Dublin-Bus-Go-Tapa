import React from 'react';

import DateTime from 'react-datetime';
//import '../DateTime.css';

export default class Calendar extends React.Component {
  render(){

  var yesterday = DateTime.moment().subtract( 1, 'day' );
  var valid = function( current ){
    return current.isAfter( yesterday );
  };

    return (
      <div>
        <DateTime isValidDate={ valid } placeholder="Date & Time" onChange={this.props.handleDate}/>
      </div>
        )
    }
}
