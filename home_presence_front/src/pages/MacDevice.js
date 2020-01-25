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
        this.nameChange = this.nameChange.bind(this)
    }

    goBack() {
        this.setState(state => ({
            go_back: true
        }));
    }

    nameChange(event) {
        console.log(event)
        this.setState(state => ({
            name: event.value
        }));
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
                        <input type="text" value={this.state.name} onChange={this.nameChange}/>
                        <button> Change name </button>
                    </div>
                    <a onClick={this.goBack}> Back </a>
                </div>
    }
}

export default MacDevice;