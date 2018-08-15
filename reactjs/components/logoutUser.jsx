import React from "react"
import { BrowserRouter } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
export default class LogoutUser extends React.Component {
  state = {
    redirect: false
  }
  setRedirect = () => {
    this.setState({
      redirect: true
    })
  }
  renderRedirect = () => {
//    fetch('/logout',{method: "GET", credentials: 'same-origin'})
    //if (this.state.redirect) {
      return <Redirect to='/' />
    //}
  }
  render () {
    return (
        <BrowserRouter>
       <div>
       // {this.renderRedirect()}
        <button onClick={this.renderRedirect}>Redirect</button>
       </div>
        </BrowserRouter>
    )
  }
}
