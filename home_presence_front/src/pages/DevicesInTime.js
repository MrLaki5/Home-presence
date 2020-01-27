import React from 'react';
import { Redirect } from "react-router-dom";
import MacDeviceLine from "../components/MacDeviceLine"


class DevicesInTime extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            macs: [],
            go_back: false
        };
        this.getData = this.getData.bind(this)
        this.goBack = this.goBack.bind(this)
        this.goDevice = this.goDevice(this)
    }

    componentDidMount() {
        this.getData()
    }

    getData() {
        // create a new XMLHttpRequest
        var xhr = new XMLHttpRequest()

        // get a callback when the server responds
        xhr.addEventListener('load', () => {
            // update the state of the component with the result here
            console.log(xhr.responseText)
            var data_obj = JSON.parse(xhr.responseText);
            this.setState(state => ({
                macs: data_obj.mac_logs
            }));
        })
        var params = "?time=" + this.props.location.state.time
        console.log(params)
        // open the request with the verb and the url
        xhr.open('GET', 'http://' + process.env.REACT_APP_SERVER_ADDRESS + ':' + process.env.REACT_APP_SERVER_PORT + '/mac_in_time' + params)
        // send the request
        xhr.send()
    }

    goBack() {
        this.setState(state => ({
            go_back: true
        }));
    }

    goDevice(deviceName) {
        console.log("prona")
    }

    render() {
        if (this.state.go_back) {
            return <Redirect to={{
                pathname: "/"
            }}/>;
        }
        const mac_addresses = this.state.macs.map((mac, index) =>
            <MacDeviceLine key={index} mac={mac["mac"]} name={mac["name"]} time={this.props.location.state.time}/>
        );
        return  <div>
                    {mac_addresses}
                    <a onClick={this.goBack}> Back </a>
                </div>
    }
}

export default DevicesInTime;