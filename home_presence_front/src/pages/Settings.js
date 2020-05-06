import React from 'react';

import Menu_HP from '../components/Menu_HP'
import Title_HP from '../components/Title_HP'
import '../app.css'

import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'


class MacDevice extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            worker_status: false
        };
        this.checkWorkerStatus = this.checkWorkerStatus.bind(this)
        this.sendWorkerChange = this.sendWorkerChange.bind(this)
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
                        <FormControlLabel
                            style={{color: 'var(--main-primary-color)', fontSize: '3.5vw'}}
                            control={
                                <Switch
                                    style={{color: 'var(--main-primary-color)'}}
                                    checked={this.state.worker_status}
                                    onChange={this.sendWorkerChange}
                                    value="checkedB"
                                    color="secondary"
                                />
                            }
                            label="Active mode"
                        />
                    </Grid>

                </Grid>
    }
}

export default MacDevice;