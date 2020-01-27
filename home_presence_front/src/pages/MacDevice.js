import React from 'react';
import { Redirect } from "react-router-dom";


class MacDevice extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            go_back: false,
            name: this.props.location.state.name
        };
        this.goBack = this.goBack.bind(this)
        this.handleNameChange = this.handleNameChange.bind(this)
        this.sendNameChange = this.sendNameChange.bind(this)
    }

    goBack() {
        this.setState(state => ({
            go_back: true
        }));
    }

    handleNameChange(event) {
        const value = event.target.value || ""
        this.setState(state => ({
            name: value
        }));
    }

    sendNameChange(event) {
        // create a new XMLHttpRequest
        var xhr = new XMLHttpRequest()

        // get a callback when the server responds
        xhr.addEventListener('load', () => {
            // update the state of the component with the result here
            console.log(xhr.responseText)
        })
        var params = "name=" + this.state.name + "&mac=" + this.props.location.state.mac
        console.log(params)
        // open the request with the verb and the url
        xhr.open('POST', 'http://' + process.env.REACT_APP_SERVER_ADDRESS + ':' + process.env.REACT_APP_SERVER_PORT + '/change_name')
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // send the request
        xhr.send(params)
    }

    render() {
        if (this.state.go_back) {
            if (!this.props.location.state.time_back)
                return <Redirect to={{
                    pathname: "/"
                }}/>;
            else {
                return <Redirect to={{
                pathname: "/specific_time",
                state: {
                    time: this.props.location.state.time_back
                }
            }}/>;
            }
        }
        return  <div>
                    <div>
                        {this.props.location.state.mac}
                    </div>
                    <div>
                        <input type="text" value={this.state.name} onChange={this.handleNameChange} />
                        <button onClick={this.sendNameChange}> Change name</button>
                    </div>
                    <a onClick={this.goBack}> Back </a>
                </div>
    }
}

export default MacDevice;