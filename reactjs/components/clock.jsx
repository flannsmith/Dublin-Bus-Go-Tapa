import React from 'react';

export default class Clock extends React.Component {
  constructor(props) {
    super(props);

    this.stopTimer = this.stopTimer.bind(this);
    this.tick = this.tick.bind(this);
    this.interval = this.interval.bind(this);
    
  }

  stopTimer() {
    clearInterval(this.intervalID);
  }

  tick() {
    this.props.tick();
  }

  interval() {
    this.intervalID = setInterval(
      () => this.tick(),
      1000
     );
  }

  render() {
        
        if (this.props.timer){
           this.interval();
           this.props.resetStartTimer(false); 
        }

        if (this.props.stopTimer) {
            this.stopTimer();
        }

        return(null);  
    }
}
