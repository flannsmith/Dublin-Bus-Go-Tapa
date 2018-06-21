import React from "react";

export default class Aboutparagraph extends React.Component {


   render () {
    return (
        <div className="container-fluid; padding:10%">
        <div className="row">
        <div className="col-lg-3"></div>
        <div className="col-lg-6">
        <p>{ this.props.text }</p>

         </div>
         <div className="col-lg-3"></div>
         </div></div>
        )
   }
}
