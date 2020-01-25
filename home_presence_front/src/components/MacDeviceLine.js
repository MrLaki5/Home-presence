import React from 'react';
import { Redirect } from "react-router-dom";


class MacDeviceLine extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            go_device: false
        };
        this.goDevice = this.goDevice.bind(this)
    }

    goDevice() {
        this.setState(state => ({
            go_device: true
        }));
    }

    render() {
        if (this.state.go_device) {
            return <Redirect to={{
                pathname: "/mac_device",
                state: {
                    mac: this.props.mac,
                    time_back: this.props.time,
                    name: this.props.name
                }
            }}/>;
        }
        return  <div>
                    <a onClick={this.goDevice}>
                        mac: {this.props.mac} name: {this.props.name}
                    </a>
                </div>
    }
}

export default MacDeviceLine;