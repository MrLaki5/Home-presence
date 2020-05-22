import React from 'react';

import Menu_HP from '../components/Menu_HP'
import Title_HP from '../components/Title_HP'
import '../app.css'

import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Hidden from '@material-ui/core/Hidden';


class MacDevice extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            worker_status: false,
            sleep_time_db: 0,
            network_mask: "",
            sleep_time_mac: 0,
            max_miss_count: 0
        };
        this.checkWorkerStatus = this.checkWorkerStatus.bind(this)
        this.sendWorkerChange = this.sendWorkerChange.bind(this)
        this.checkSettings = this.checkSettings.bind(this)
    }

    componentDidMount() {
        this.checkWorkerStatus()
        this.checkSettings()
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
                    worker_status: true
                }));
            }
            else {
                this.setState(state => ({
                    worker_status: false
                }));
            }
        })
        // open the request with the verb and the url
        xhr.open('GET', 'http://' + process.env.REACT_APP_SERVER_ADDRESS + ':' + process.env.REACT_APP_SERVER_PORT + '/workers_status')
        // send the request
        xhr.send()
    }

    checkSettings() {
        // create a new XMLHttpRequest
        var xhr = new XMLHttpRequest()

        // get a callback when the server responds
        xhr.addEventListener('load', () => {
            // update the state of the component with the result here
            console.log(xhr.responseText)
            var data_obj = JSON.parse(xhr.responseText);
            this.setState(state => ({
            
                sleep_time_db: data_obj["sleep_time_db"],
                network_mask: data_obj["network_mask"],
                sleep_time_mac: data_obj["sleep_time_mac"],
                max_miss_count: data_obj["max_miss_count"]
            }));

        })
        // open the request with the verb and the url
        xhr.open('GET', 'http://' + process.env.REACT_APP_SERVER_ADDRESS + ':' + process.env.REACT_APP_SERVER_PORT + '/settings')
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
                if (this.state.worker_status === false){
                    this.setState(state => ({
                        worker_status: true
                    }));
                }
                else {
                    this.setState(state => ({
                        worker_status: false
                    }));
                }
            }
        })
        if (this.state.worker_status === false){
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
        return  <Grid container className='MainContainer'>

                    {/* Title */}
                    <Title_HP/>


                    {/* Menu */}
                    <Menu_HP current_page={2}/>


                    <Grid item xs={12}>
                        <Hidden only={['xs', 'sm']}>
                            {/* Button PC */}
                            <FormControlLabel
                                style={{color: 'var(--main-primary-color)', fontSize: '1.5vw'}}
                                control={
                                    <Switch
                                        style={{color: 'var(--main-primary-color)'}}
                                        checked={this.state.worker_status}
                                        onChange={this.sendWorkerChange}
                                        value="checkedB"
                                        color="secondary"
                                    />
                                }
                                label={ "Active mode: " + ((this.state.worker_status)? "ON": "OFF")}
                            />
                        </Hidden>
                        <Hidden only={['md', 'lg', 'xl']}>
                            {/* Button Mobile */}
                            <FormControlLabel
                                style={{color: 'var(--main-primary-color)', fontSize: '3vw'}}
                                control={
                                    <Switch
                                        style={{color: 'var(--main-primary-color)'}}
                                        checked={this.state.worker_status}
                                        onChange={this.sendWorkerChange}
                                        value="checkedB"
                                        color="secondary"
                                    />
                                }
                                label={ "Active mode: " + ((this.state.worker_status)? "ON": "OFF")}
                            />
                        </Hidden>

                    </Grid>

                </Grid>
    }
}

export default MacDevice;