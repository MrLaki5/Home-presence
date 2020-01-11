import React from 'react';
import { Redirect } from "react-router-dom";

import Graph from '../components/Graph'



class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            devices: []
        };
    }

    componentWillMount() {
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
                devices: data_obj.mac_logs
            }));
        })
        // open the request with the verb and the url
        xhr.open('GET', 'http://192.168.1.35:8001/num_logs')
        // send the request
        xhr.send()
    }

    render() {
        return (
            <Graph devices_num={this.state.devices}/>
        );
    }
}

export default App;
