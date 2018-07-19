import React from "react"
import { render } from "react-dom"
import Main from "./containers/main"

class App1 extends React.Component {
    //Top container of this react code that is bound to div with id "App1" in about.html

    render() {
        return (
                <Main> </Main>
               )
    }
}

render(<App1/>, document.getElementById('App1'))
