import React from 'react';
import { Redirect } from "react-router-dom";
import TimeLine from '../components/TimeLine';


class MacDevice extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            go_back: false,
            name: this.props.location.state.name,
            times: [],
            top_val: 10,
            time_group: "hour",
        };
        this.goBack = this.goBack.bind(this)
        this.handleNameChange = this.handleNameChange.bind(this)
        this.sendNameChange = this.sendNameChange.bind(this)
        this.getData = this.getData.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSelectTimeChange = this.handleSelectTimeChange.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    handleInputChange(event) {
        this.setState({top_val: event.target.value}, () => this.getData());
    }

    handleSelectTimeChange(event){
        this.setState({time_group: event.target.value}, () => this.getData());
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
                times: data_obj.times
            }));
        })
        var params = "mac=" + this.props.location.state.mac + "&time_group=" + this.state.time_group + "&top=" + this.state.top_val
        console.log(params)
        // open the request with the verb and the url
        xhr.open('POST', 'http://' + process.env.REACT_APP_SERVER_ADDRESS + ':' + process.env.REACT_APP_SERVER_PORT + '/time_for_mac')
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // send the request
        xhr.send(params)
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
                    time: this.props.location.state.time_back,
                    time_group: this.props.location.state.time_group
                }
            }}/>;
            }
        }
        const times = this.state.times.map((time_curr, index) =>
            <TimeLine key={index} time={time_curr}/>
        );
        return  <div>
                    <div>
                        {this.props.location.state.mac}
                    </div>
                    <div>
                        <input type="text" value={this.state.name} onChange={this.handleNameChange} />
                        <button onClick={this.sendNameChange}> Change name</button>
                    </div>
                    <div>
                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={this.state.top_val}
                            onChange={this.handleInputChange}
                        />
                        <select
                            value={this.state.time_group}
                            onChange={this.handleSelectTimeChange}
                        >
                            <option value="hour">Hour</option>
                            <option value="day">Day</option>
                            <option value="month">Month</option>
                            <option value="year">Year</option>
                        </select>
                    </div>
                    <div>
                        {times}
                    </div>
                    <a onClick={this.goBack}> Back </a>
                </div>
    }
}

export default MacDevice;