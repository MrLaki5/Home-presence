import React from 'react';
//import { Redirect } from "react-router-dom";

import Graph from '../components/Graph'



class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            devices: [],
            top_val: 10,
            time: "hour"
        };
        this.getData = this.getData.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSelectTimeChange = this.handleSelectTimeChange.bind(this)
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
                devices: data_obj.mac_logs
            }));
        })
        var params = "?top=" + this.state.top_val + "&time_group=" + this.state.time
        console.log(params)
        // open the request with the verb and the url
        xhr.open('GET', 'http://192.168.1.35:8001/num_logs' + params)
        // send the request
        xhr.send()
    }

    handleInputChange(event) {
        this.setState({top_val: event.target.value}, () => this.getData());
    }

    handleSelectTimeChange(event){
        this.setState({time: event.target.value}, () => this.getData());
    }

    render() {
        return (
            <div>
                <input
                    type="range"
                    min="1"
                    max="20"
                    value={this.state.top_val}
                    onChange={this.handleInputChange}
                />
                <select
                    value={this.state.time}
                    onChange={this.handleSelectTimeChange}
                >
                  <option value="hour">Hour</option>
                  <option value="day">Day</option>
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                </select>
                <Graph devices_num={this.state.devices}/>
            </div>
        );
    }
}

export default App;
