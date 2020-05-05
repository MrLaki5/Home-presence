import React from 'react';
import { Redirect } from "react-router-dom";

import Menu_HP from '../components/Menu_HP'
import Title_HP from '../components/Title_HP'
import '../app.css'

import Grid from '@material-ui/core/Grid';


class MacDevice extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            go_back: false,
            worker_status: "TURN ON"
        };
        this.goBack = this.goBack.bind(this)
        this.checkWorkerStatus = this.checkWorkerStatus.bind(this)
        this.sendWorkerChange = this.sendWorkerChange.bind(this)
    }

    goBack() {
        this.setState(state => ({
            go_back: true
        }));
    }

    componentDidMount() {
        this.checkWorkerStatus()
    }

    checkWorkerStatus() {
        // create a new XMLHttpRequest
        var xhr = new XMLHttpRequest()

        // get a callback when the server responds
        xhr.addEventListener('load', () => {
            // update the state of the component with the result here
            console.log(xhr.responseText)
            var data_obj = JSON.parse(xhr.responseText);
            if (data_obj["state"] === "running"){
                this.setState(state => ({
                    worker_status: "TURN OFF"
                }));
            }
            else {
                this.setState(state => ({
                    worker_status: "TURN ON"
                }));
            }
        })
        // open the request with the verb and the url
        xhr.open('GET', 'http://' + process.env.REACT_APP_SERVER_ADDRESS + ':' + process.env.REACT_APP_SERVER_PORT + '/workers_status')
        // send the request
        xhr.send()
    }

    sendWorkerChange(event) {
        // create a new XMLHttpRequest
        var xhr = new XMLHttpRequest()

        // get a callback when the server responds
        xhr.addEventListener('load', () => {
            // update the state of the component with the result here
            console.log(xhr.responseText)
            var data_obj = JSON.parse(xhr.responseText);
            if (data_obj["status"] === "success"){
                if (this.state.worker_status === "TURN ON"){
                    this.setState(state => ({
                        worker_status: "TURN OFF"
                    }));
                }
                else {
                    this.setState(state => ({
                        worker_status: "TURN ON"
                    }));
                }
            }
        })
        if (this.state.worker_status === "TURN ON"){
            // open the request with the verb and the url
            xhr.open('GET', 'http://' + process.env.REACT_APP_SERVER_ADDRESS + ':' + process.env.REACT_APP_SERVER_PORT + '/workers_start')
        }
        else {
            // open the request with the verb and the url
            xhr.open('GET', 'http://' + process.env.REACT_APP_SERVER_ADDRESS + ':' + process.env.REACT_APP_SERVER_PORT + '/workers_stop')
        }
        // send the request
        xhr.send()
    }

    render() {
        if (this.state.go_back) {
            return <Redirect to={{
                pathname: "/"
            }}/>;
        }
        return  <Grid container className='MainContainer'>

                    {/* Title */}
                    <Title_HP/>


                    {/* Menu */}
                    <Menu_HP current_page={2}/>

                    <div>
                        <button onClick={this.sendWorkerChange}> {this.state.worker_status} </button>
                    </div>
                    <a onClick={this.goBack}> Back </a>
                </Grid>
    }
}

export default MacDevice;