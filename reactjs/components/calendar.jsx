import React from 'react';

import DateTime from 'react-datetime';
//import '../DateTime.css';

export default class Calendar extends React.Component {
  render(){
    return (
      <div>
        <DateTime onChange={this.props.handleDate}/>
      </div>
        )
    }
}
